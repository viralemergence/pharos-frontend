import { useStaticQuery, graphql } from 'gatsby'

import { AirtableCMSData } from '@talus-analytics/library.airtable-cms'

// Sites will have many of these content hooks, each
// of which corresponds to one table in Airtable.
const useIndexPageData = () => {
  const { cmsContent }: { cmsContent: AirtableCMSData } =
    useStaticQuery(graphql`
      query cmsContentQuery {
        cmsContent: allAirtable(filter: { table: { eq: "Table 1" } }) {
          nodes {
            data {
              Name
              Text
              Image {
                localFiles {
                  childImageSharp {
                    gatsbyImageData(height: 200, placeholder: TRACED_SVG)
                  }
                }
              }
            }
          }
        }
      }
    `)

  return cmsContent
}

export default useIndexPageData
