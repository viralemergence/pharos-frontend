import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import Expander, { ExpanderProps } from '@talus-analytics/library.ui.expander'

const InteractionTarget = styled.div`
  // start a new block context to capture margins
  display: flow-root;
`

export interface DropdownProps
  extends Omit<ExpanderProps, 'open' | 'style' | 'floating'> {
  /**
   * render prop for the button which opens and closes the
   * dropdown. This function gets passed "open" and "animDuration"
   * props, and must render a button.
   */
  renderButton: (
    open: boolean,
    animDuration: number
  ) => React.ReactElement<React.ButtonHTMLAttributes<HTMLButtonElement>>
  /** Trigger the dropdown on hover instead of click */
  hover?: boolean
  /** onOpen effect, which is called whenever the dropdown opens */
  onOpen?: () => void
  /**
   * onOpen effect, which is called whenever the
   * dropdown closes, but not when it mounts closed.
   */
  onClose?: () => void
  /**
   * CSS object to pass to the expander to resolve
   * issues with z-index, border-radius, or shadow.
   */
  expanderStyle?: React.CSSProperties
  animDuration?: number
  /** This prop allows the open/closed state of the dropdown to be controlled by its parent */
  open?: boolean
  /** This prop allows the open/closed state of the dropdown to be controlled by its parent */
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>
  floating?: boolean
}

const Dropdown = ({
  renderButton,
  children,
  onOpen,
  onClose,
  hover = false,
  floating = true,
  animDuration = 250,
  expanderStyle = {},
  ...props
}: DropdownProps) => {
  let [open, setOpen] = useState<boolean>(false)
  // If open and setOpen are provided through props, use those instead
  if (props.open !== undefined && props.setOpen !== undefined) {
    open = props.open
    setOpen = props.setOpen
  }
  const openDropdown = () => setOpen(true)
  const closeDropdown = () => setOpen(false)
  const toggleDropdown = () => setOpen(prev => !prev)

  const [touchScreen, setTouchScreen] = useState(false)

  // Handle touch screens: if a touch event is detected, override the
  // hover prop to change the behavior to respond to tap events as
  // though the dropdown was in click-to-open mode the whole time.
  // detecting touch events like this is a better way to detect
  // what the user wants rather than what the device can do, like
  // in cases where the user is using a touchscreen laptop but
  // might only be using their mouse, in which case we would still
  // want the dropdown to act as a hover dropdown and not a tap dropdown.
  useEffect(() => {
    const handleTouch = () => setTouchScreen(true)

    if (typeof window !== 'undefined') {
      window.addEventListener('touchstart', handleTouch)
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('touchstart', handleTouch)
      }
    }
  }, [])

  // handle onOpen and onClose effects
  useEffect(() => {
    open === true && onOpen && onOpen()
    open === false && onClose && onClose()
  }, [open, onClose, onOpen])

  const dropdownRef = useRef<HTMLDivElement>(null)

  const onBlurHandler = (e: React.FocusEvent<HTMLDivElement>) => {
    if (dropdownRef.current?.contains(e.relatedTarget)) return
    closeDropdown()
  }

  // by default, clicking the button opens / closes the expander
  let mouseHandlers: {
    [key: string]: (e: React.MouseEvent<HTMLButtonElement>) => void
  } = { onClick: () => toggleDropdown() }

  let hoverHandlers: { [key: string]: () => void } = {}
  // if hover is true, only allow onClick events from the keyboard
  // (detected because the clientX and clientY are zero) and use
  // onMouseEnter and onMouseLeave to open / close the dropdown
  if (hover) {
    mouseHandlers = {
      onClick: e => {
        if (touchScreen) toggleDropdown()
        if (e.clientX === 0 && e.clientY === 0) toggleDropdown()
      },
    }
    hoverHandlers = {
      onMouseEnter: () => {
        if (!touchScreen) openDropdown()
      },
      onMouseLeave: () => closeDropdown(),
    }
  }

  // render the renderButton render props function,
  // and clone it with the new props we need
  const buttonWithProps = React.cloneElement(
    { ...renderButton(open ?? false, animDuration) },
    {
      ...mouseHandlers,
      ...hoverHandlers,
      'aria-expanded': open ? 'true' : 'false',
      'aria-haspopup': 'true',
    }
  )

  // check if we're being passed the right kind
  // of element in the render prop function
  if (
    // standard react elements will have type as a string
    (typeof buttonWithProps.type === 'string' &&
      buttonWithProps.type !== 'button') ||
    // styled components have type.target
    (typeof buttonWithProps.type === 'object' &&
      (buttonWithProps.type as any).target !== 'button')
  ) {
    const type =
      (typeof buttonWithProps.type === 'string' && buttonWithProps.type) ||
      (typeof buttonWithProps.type === 'object' &&
        (buttonWithProps.type as { target: string }).target)
    throw new Error(
      `renderButton render prop in dropdown ` +
        `must render a button element for accessibility. ` +
        `Element type found was ${type}.`
    )
  }

  return (
    <div onBlur={onBlurHandler} ref={dropdownRef}>
      {buttonWithProps}
      <Expander
        {...props}
        floating={floating}
        style={expanderStyle}
        open={open}
        animDuration={animDuration}
      >
        <InteractionTarget {...hoverHandlers} tabIndex={-1}>
          {children}
        </InteractionTarget>
      </Expander>
    </div>
  )
}

export default Dropdown
