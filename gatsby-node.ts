import { GatsbyNode } from 'gatsby'
import path from 'path'

import { extendObjectByPath } from './src/utilities/objectPathTools'

interface DocsPathQuery {
  allMarkdownRemark: {
    nodes: {
      fileAbsolutePath: string
      id: string
      frontmatter: {
        title: string
        order: string
      }
    }[]
  }
}

export interface PageInfo {
  id: string
  title: string
  path: string
  order: string
}

export interface SiteMap {
  [key: string]: Record<string, SiteMap> | PageInfo
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
          id
          fileAbsolutePath
          frontmatter {
            title
            order
          }
        }
      }
    }
  `)

  if (!docsPathsQuery.data) throw new Error('No data readme pages')

  // construct sitemap of all the file paths
  const pages: { id: string; path: string; title: string; order: string }[] = []
  const siteMap: SiteMap = {}

  for (const pathNode of docsPathsQuery.data.allMarkdownRemark.nodes) {
    // absolute path of the pharos-documentation repo
    const basePath = `${__dirname}/src/pharos-documentation`

    // strip off the basePath and the extension
    let relativePath = pathNode.fileAbsolutePath
      .replace(basePath, '')
      .replace('.md', '')

    // skip the readme in the root of the repository
    if (relativePath === '/README') continue

    // if it's a README not in the root
    // directory, make it an index page.
    if (relativePath.split('/').at(-1) === 'README')
      relativePath = relativePath.replace('README', '')
    else relativePath += '/'

    const steps = relativePath.split(/(?=\/)/g)

    extendObjectByPath({
      obj: siteMap,
      path: steps,
      valueObj: {
        id: pathNode.id,
        path: relativePath,
        title: pathNode.frontmatter.title,
        order: pathNode.frontmatter.order,
      },
    })

    pages.push({
      id: pathNode.id,
      path: relativePath,
      title: pathNode.frontmatter.title,
      order: pathNode.frontmatter.order,
    })
  }

  for (const page of pages) {
    actions.createPage({
      path: page.path,
      component: DefaultDocsPage,
      context: { id: page.id, siteMap },
    })
  }
}
