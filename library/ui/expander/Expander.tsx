import React, { useLayoutEffect, useState } from 'react'
import styled from 'styled-components'

export interface ExpanderProps {
  /** child elements to render inside the expander */
  children: React.ReactNode
  /** whether or not the expander is open */
  open: boolean | undefined
  /** animation duration in number of milliseconds */
  animDuration?: number
  /**
   * If set to true, the container will be absolutely
   * positioned with a shadow, to make a dropdown type
   * component which doesn't interefere with layout.
   */
  floating?: boolean
  /** Styles object to pass on to the container */
  style?: React.CSSProperties
  /**
   * Render children as "hidden" while closed mainly
   * for implementing tabbed sections without hiding
   * that content from SEO
   */
  renderWhileClosed?: boolean
  /**
   * Animate
   */
}

const ContentContainer = styled.div`
  // force this to be a new Block Formatting Context to contain
  // margins that the children might set.
  /* https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Block_formatting_context */
  display: flow-root;
`

const Expander = ({
  open,
  children,
  floating = false,
  animDuration = 250,
  style = {},
  renderWhileClosed = false,
}: ExpanderProps) => {
  // persist animation timer reference across renders to handle animation cancelling
  const animTimer = React.useRef<ReturnType<typeof setTimeout>>()

  // ref for measuring the height of the content inside the section
  const contentContainer = React.useRef<HTMLDivElement>(null)

  // rendering children or not is differnet from the open and close status
  // of the expander because they need to render before the animation starts
  // to open and stop rendering only after the animation finishes closing.
  // not rendering children while the expander is closed is important for
  // both performance and accessibility (takes invisible things out of the tree)
  const [renderChildren, setRenderChildren] = useState(open ?? false)

  // height of the collapsing section which animates to hide / reveal children
  const [hiderHeight, setHiderHeight] = useState<string | number | undefined>(
    open ? 'auto' : 0
  )

  // layout effect to handle state changes
  // relative to all possible current statuses,
  // and handle DOM measurement when necessary
  useLayoutEffect(() => {
    // Extra SSR safety
    if (typeof window === 'undefined') return

    // if expander is closed and needs to be open
    if (open && hiderHeight === 0) {
      // reset timer to interupt current animation
      if (animTimer.current) clearTimeout(animTimer.current)

      // render children in so we can measure height
      setRenderChildren(true)

      window.requestAnimationFrame(() => {
        // measure and set animatable height
        setHiderHeight(contentContainer.current?.getBoundingClientRect().height)

        // at the end of the animation, set the height
        // to auto so that it will adjust properly when
        // the window resizes
        animTimer.current = setTimeout(() => {
          setHiderHeight('auto')
        }, animDuration)
      })
    }

    // if expander is open and needs to be closed
    if (!open && hiderHeight === 'auto') {
      // reset timer to interupt current animation
      if (animTimer.current) clearTimeout(animTimer.current)

      // using nested requestAnimationFrame here so that
      // react absolutely has to run these steps separate
      // render cycles (can't optimize this state change).
      window.requestAnimationFrame(() => {
        // can't animate "auto" so measure and set current height
        setHiderHeight(contentContainer.current?.getBoundingClientRect().height)

        // set the height to 0 one frame after the
        // height is rendered into the DOM
        window.requestAnimationFrame(() => {
          setHiderHeight(0)

          // remove the children at the end of the animation
          animTimer.current = setTimeout(() => {
            setRenderChildren(false)
          }, animDuration)
        })
      })
    }
  }, [open, hiderHeight, animDuration])

  return (
    <div
      style={{
        height: hiderHeight,
        overflow: hiderHeight === 'auto' ? 'visible' : 'hidden',
        transition: `${animDuration}ms ease`,
        ...(floating && {
          borderBottomRightRadius: 5,
          borderBottomLeftRadius: 5,
          background: 'white',
          position: 'absolute',
          boxShadow: '0px 15px 30px -10px rgba(0, 0, 0, 0.25)',
          zIndex: 10,
        }),
        ...style,
      }}
    >
      <ContentContainer
        ref={contentContainer}
        style={{
          ...{
            ...(renderWhileClosed && {
              display: renderChildren ? 'flow-root' : 'none',
            }),
          },
        }}
      >
        {(renderChildren || renderWhileClosed) && children}
      </ContentContainer>
    </div>
  )
}

export default Expander
