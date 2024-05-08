import { useStaticQuery, graphql } from 'gatsby'

import { AirtableCMSData } from 'components/library/airtable-cms'

// Sites will have many of these content hooks, each
// of which corresponds to one table in Airtable.
const useSignInPageData = () => {
  const { signInData }: { signInData: AirtableCMSData } =
    useStaticQuery(graphql`
      query signInDataQuery {
        signInData: allAirtable(filter: { table: { eq: "Sign In" } }) {
          nodes {
            data {
              Name
              Text
              # Image {
              #   localFiles {
              #     childImageSharp {
              #       gatsbyImageData(height: 70, placeholder: NONE)
              #     }
              #   }
              # }
            }
          }
        }
      }
    `)

  return signInData
}

export default useSignInPageData
