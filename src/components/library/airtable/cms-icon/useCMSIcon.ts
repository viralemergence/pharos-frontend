import { useContext } from 'react'

import replaceFill from './replaceFill'

import { IconsContext } from './CMSIconContext'

interface Icon {
  svg: string
  text: string
}

function useCMSIcon(
  name: string,
  color: string | undefined,
  noEmitError: true
): Icon | undefined
function useCMSIcon(
  name: string,
  color: string | undefined,
  noEmitError: boolean
): Icon | undefined
function useCMSIcon(
  name: string,
  color: string | undefined,
  noEmitError?: false
): Icon
function useCMSIcon(
  name: string,
  color?: string | undefined,
  noEmitError?: true | false | boolean | undefined
) {
  const iconsQuery = useContext(IconsContext)
  if (!iconsQuery) return undefined
  const icons = iconsQuery.nodes
  if (!icons)
    throw new Error(
      `Icons not found in iconsQuery result. ` +
        `Check return value from useIconsQuery().`
    )

  if (icons.length === 0) {
    if (noEmitError) return undefined
    throw new Error(
      `No icons found in icons context. Does a parent ` +
        `component include the <CMSIconsProvider /> ` +
        `component and is that component passed a non-empty ` +
        `result from useCMSIconsQuery() query hook? `
    )
  }

  const icon = icons.find(icon => icon.data.Name === name)

  if (!icon?.data.SVG) {
    if (noEmitError === true) return undefined

    throw new Error(
      `Icon ${name} not found in ` +
        `Airtable. Does the airtable base include the ` +
        `Icons table, and does that table include ` +
        `an icon called ${name}?`
    )
  }

  let svgString = icon.data.SVG.localFiles[0].childSvg.svgString
  if (color)
    svgString = replaceFill(
      icon.data.SVG.localFiles[0].childSvg.svgString,
      color
    )

  return { text: icon.data.Text, svg: svgString }
}

export default useCMSIcon
