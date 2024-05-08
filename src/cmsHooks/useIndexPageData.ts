import { useStaticQuery, graphql } from 'gatsby'

import { AirtableCMSData } from 'components/library/airtable-cms'

// Sites will have many of these content hooks, each
// of which corresponds to one table in Airtable.
const useIndexPageData = () => {
  const { cmsContent }: { cmsContent: AirtableCMSData } =
    useStaticQuery(graphql`
      query cmsContentQuery {
        cmsContent: allAirtable(filter: { table: { eq: "Landing Page" } }) {
          nodes {
            data {
              Name
              Text
              Image {
                localFiles {
                  childImageSharp {
                    gatsbyImageData(height: 114, placeholder: NONE)
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
