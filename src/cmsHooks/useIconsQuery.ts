import { useStaticQuery, graphql } from 'gatsby'
import { AirtableCMSData } from '@talus-analytics/library.airtable-cms'

const useIconsQuery = () => {
  const { iconsQuery }: { iconsQuery: AirtableCMSData } =
    useStaticQuery(graphql`
      query iconsQuery {
        iconsQuery: allAirtable(filter: { table: { eq: "Icons" } }) {
          nodes {
            data {
              Name
              Text
              SVG {
                localFiles {
                  childSvg {
                    svgString
                  }
                }
              }
            }
          }
        }
      }
    `)

  return iconsQuery
}

export default useIconsQuery
