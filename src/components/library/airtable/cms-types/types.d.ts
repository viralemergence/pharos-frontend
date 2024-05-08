import {
  FileNode,
  IGatsbyImageDataParent,
} from 'gatsby-plugin-image/dist/src/components/hooks'
import { IGatsbyImageData } from 'gatsby-plugin-image'

export interface AirtableCMSData {
  nodes: {
    data: {
      Name: string // name is used as the identifier
      Text: string // text is required for accessibility
      Image?: {
        localFiles: FileNode[] &
          { childImageSharp: IGatsbyImageDataParent<IGatsbyImageData> }[]
      }
      Download?: {
        localFiles: {
          name: string
          prettySize: string
          publicURL: string
        }[]
      }
      SVG?: {
        localFiles: {
          childSvg: {
            svgString: string
          }
        }[]
      }
    }
  }[]
}
