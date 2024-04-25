import { useContext, useMemo } from 'react'
import { parse, HTMLElement } from 'node-html-parser'

import { IconsContext } from './CMSIconContext'

interface IconNode {
  name: string
  svg: HTMLElement
  text: string
}

const useAllCMSIcons = () => {
  let iconsQuery = useContext(IconsContext)
  // for when the hook hasn't run yet
  if (!iconsQuery) iconsQuery = { nodes: [] }

  const nodes = iconsQuery.nodes

  const icons = useMemo(() => {
    const iconNodes = [] as IconNode[]

    nodes.forEach(node => {
      const svg = node.data.SVG?.localFiles[0].childSvg.svgString
      if (!svg) return

      iconNodes.push({
        name: node.data.Name,
        svg: parse(svg),
        text: node.data.Text,
      })
    })

    return iconNodes
  }, [nodes])

  return icons
}

export default useAllCMSIcons
