// this is the AirtableCMSIcon component, but with
// the query result from airtable substituted in.
// This is essentially what happens when Gatsby
// runs the query and returns the static result.

// This component is very outdated and should not
// be used for anything except the bit playground.

import React, { useState } from 'react'
import styled from 'styled-components'

import { HTMLElement, parse } from 'node-html-parser'

import demoQueryResult from './demoQueryResult'

// replace the fill and stroke colors on all child
// elements of the SVG; but only if those elements
// already have a fill or stroke set.
const replaceFill = (svg: string, color: string) => {
  // this uses node-html-parser instead of native DOM
  // so that it will support server-side-rendering.
  const svgDom = parse(svg)
  const svgElement = svgDom.querySelector('svg')!
  const children = svgElement.childNodes

  for (let child of children) {
    // note this is the node-html-parser implementation
    // of the HTMLElement class, not a native HTMLElement
    if (child instanceof HTMLElement) {
      if (child.hasAttribute('fill')) child.setAttribute('fill', color)
      if (child.hasAttribute('stroke')) child.setAttribute('stroke', color)
    }
  }
  return svgDom.toString()
}

const SVGContainer = styled.div`
  // make the SVG responsive so it takes the size of the parent;
  // stop it from sending mouseout events to the parent
  & > svg {
    width: 100%;
    height: 100%;
    pointer-events: none;
  }
`

// This query and interface lives here because it assumes the
// CMS airtable base has this table already, because the table
// will be part of the template.
interface IconsQuery {
  iconsQuery: {
    nodes: {
      data: {
        Name: string
        Text: string
        SVG: {
          localFiles: {
            childSvg: {
              svgString: string
            }
          }[]
        }
      }
    }[]
  }
}

interface AirtableCMSImageProps {
  /** Name of the icon in the icons tab */
  name: string
  /** color of the icon; note icons only accept one color */
  color: string
  /** className which will be applied to the svg container */
  className?: string
  /** color to change the icon to when hovered */
  hoverColor?: string
  /** CSS styles to apply to the svg container */
  style?: React.CSSProperties
  /**
   * Suppress missing icon error message;
   * component will return a fragment instead
   */
  noEmitError?: boolean
}

const AirtableCMSIcon = ({
  name,
  color,
  className,
  hoverColor,
  style,
  noEmitError = false,
}: AirtableCMSImageProps): JSX.Element => {
  const {
    iconsQuery: { nodes: icons },
  } = demoQueryResult as IconsQuery

  const icon = icons.find(({ data }) => data.Name === name)
  const [hover, setHover] = useState(false)

  if (!icon) {
    if (noEmitError) return <></>

    throw new Error(
      `Icon ${name} not found in ` +
        `Airtable. Does the airtable base include the ` +
        `Icons table, and does that table include ` +
        `an icon called ${name}?.`
    )
  }

  const displayIcon = replaceFill(
    icon.data.SVG.localFiles[0].childSvg.svgString,
    hover && hoverColor ? hoverColor : color
  )

  // only add mouseEnter and mouseLeave events
  // if there is a hover color specified
  let mouseHandlers = {}
  if (hoverColor)
    mouseHandlers = {
      onMouseEnter: () => setHover(true),
      onMouseLeave: () => setHover(false),
    }

  return (
    <SVGContainer
      role="img"
      aria-label={icon.data.Text}
      style={style}
      className={className}
      dangerouslySetInnerHTML={{ __html: displayIcon }}
      {...mouseHandlers}
    />
  )
}

export default AirtableCMSIcon
