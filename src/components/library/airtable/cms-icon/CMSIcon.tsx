import React, { useState } from 'react'
import styled from 'styled-components'

import useCMSIcon from './useCMSIcon'

const Container = styled.div`
  // make the SVG responsive so it takes the size of the parent;
  // stop it from sending mouseout events to the parent
  display: flex;
  justify-content: center;
  align-items: center;

  & > svg {
    width: 100%;
    height: 100%;
    pointer-events: none;
  }
`

export interface CMSIconProps extends React.ComponentPropsWithRef<'div'> {
  /** Name of the icon in the icons tab */
  name: string
  /** color of the icon; note icons only accept one color */
  color?: string
  /** color to change the icon to when hovered */
  hoverColor?: string
  /**
   * Suppress missing icon error message;
   * component will return a fragment instead
   */
  noEmitError?: boolean
}

const CMSIcon = React.forwardRef<HTMLDivElement, CMSIconProps>(
  (
    { name, color, hoverColor, noEmitError = false, ...props },
    ref
  ): JSX.Element => {
    const [hover, setHover] = useState(false)

    const icon = useCMSIcon(
      name,
      hover && hoverColor ? hoverColor : color,
      noEmitError
    )

    if (!icon) return <></>

    // only add mouseEnter and mouseLeave events
    // if there is a hover color specified
    let mouseHandlers = {}
    if (hoverColor)
      mouseHandlers = {
        onMouseEnter: () => setHover(true),
        onMouseLeave: () => setHover(false),
      }

    return (
      <Container
        {...props}
        ref={ref}
        role="img"
        aria-label={icon.text}
        dangerouslySetInnerHTML={{ __html: icon.svg }}
        {...mouseHandlers}
      />
    )
  }
)

export default CMSIcon
