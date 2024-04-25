import parse, { HTMLElement } from 'node-html-parser'

// helper method to parse SVG string

function replaceFill(svg: string, color: string): string
function replaceFill(svg: HTMLElement, color: string): HTMLElement
function replaceFill(svg: string | HTMLElement, color: string) {
  // skip dom parsing if possible, return HTMLElement object in that case
  if (svg instanceof HTMLElement) return recursiveRecolor(svg, color)
  return recursiveRecolor(parse(svg), color).toString()
}

// replace the fill and stroke colors on all child
// elements of the SVG; but only if those elements
// already have a fill or stroke set, recursively
// traversing nested SVG elements.
const recursiveRecolor = (dom: HTMLElement, color: string) => {
  // this uses node-html-parser instead of native DOM
  // so that it will support server-side-rendering.
  // const svgElement = svgDom.querySelector('svg')!
  const children = dom.childNodes
  if (children)
    for (const child of children) {
      // note this is the node-html-parser implementation
      // of the HTMLElement class, not a native HTMLElement
      if (child instanceof HTMLElement) {
        // recursive call handles nested SVG structures like groups
        if (child.childNodes && child.childNodes.length > 0)
          recursiveRecolor(child, color)
        if (child.hasAttribute('fill')) child.setAttribute('fill', color)
        if (child.hasAttribute('stroke')) child.setAttribute('stroke', color)
      }
    }
  return dom
}

export default replaceFill
