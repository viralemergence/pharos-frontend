import { GatsbyNode } from 'gatsby'
import path from 'path'

interface DocsPathQuery {
  allMarkdownRemark: {
    nodes: {
      fileAbsolutePath: string
      id: string
    }[]
  }
}

export const createPages: GatsbyNode['createPages'] = async ({
  actions,
  graphql,
}) => {
  const DefaultDocsPage = path.resolve(
    './src/templates/documentation/default.tsx'
  )

  const docsPathsQuery = await graphql<DocsPathQuery>(`
    {
      allMarkdownRemark {
        nodes {
          fileAbsolutePath
          id
        }
      }
    }
  `)

  for (const pathNode of docsPathsQuery.data.allMarkdownRemark.nodes) {
    // absolute path of the pharos-documentation repo
    const basePath = `${__dirname}/src/pharos-documentation`

    // strip off the basePath and the extension
    const relativePath = pathNode.fileAbsolutePath
      .replace(basePath, '')
      .replace('.md', '')

    // skip the readme in the root of the repository
    if (relativePath === '/README') continue

    // if it's a README not in the root
    // directory, make it an index page.
    if (relativePath.split('/').at(-1) === 'README')
      relativePath.replace('README', '')

    actions.createPage({
      path: relativePath,
      component: DefaultDocsPage,
      context: { id: pathNode.id },
    })

    console.log(relativePath)
  }
}
