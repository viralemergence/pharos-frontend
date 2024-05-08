import React from 'react'
import styled from 'styled-components'
import CMSIcon from 'components/library/airtable/cms-icon'

const IconHolder = styled.foreignObject`
  overflow: visible;
  display: flex;
  align-items: center;
  justify-content: center;
`

export interface CMSPlotIconProps
  extends React.SVGAttributes<SVGForeignObjectElement> {
  /** X position of the center of the icon */
  x: number
  /** Y position of the center of the icon */
  y: number
  /** Icon container height */
  height: number
  /** Icon container width */
  width: number
  /** Airtable Icon Name (will get passed to AirtableCMSIcon) */
  name: string
  /** Icon Color */
  color: string
  /** Icon hover color */
  hoverColor?: string
  /** Suppress AirtableCMSIcon missing icon error */
  noEmitError?: boolean
}

const CMSPlotIcon = React.forwardRef<HTMLDivElement, CMSPlotIconProps>(
  (
    {
      x,
      y,
      height,
      width,
      name,
      color,
      hoverColor,
      noEmitError = false,
      ...props
    },
    ref
  ): JSX.Element => (
    <IconHolder {...props} x={x - width / 2} y={y - height / 2}>
      <CMSIcon
        ref={ref}
        style={{ width, height }}
        {...{ name, color, hoverColor, noEmitError }}
      />
    </IconHolder>
  )
)

export default CMSPlotIcon
