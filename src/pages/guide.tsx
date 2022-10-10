import React from 'react'

import CMS from '@talus-analytics/library.airtable-cms'
import Providers from '../components/layout/Providers'

import Main from '../components/layout/Main'

// import useUserGuidePageData from '../cmsHooks/useUserGuidePageData'
import NavBar from 'components/layout/NavBar/NavBar'
import { graphql } from 'gatsby'

const UserGuidePage = ({ data }: { data: Data }): JSX.Element => {
  // const data = useUserGuidePageData()

  const articles = []
  for (const node of data.allMarkdownRemark.nodes) {
    // absolute path of the pharos-documentation repo
    const basePath = node.fileAbsolutePath.split('src/pharos-documentation')[0]

    // strip off the basePath and the extension
    const relativePath =
      node.fileAbsolutePath
        .replace(basePath + 'src/pharos-documentation', '')
        .replace('.md', '') + '/#'

    // if it's a README not in the root
    // directory, make it an index page.
    if (relativePath.split('/').at(-1) === 'README')
      relativePath.replace('README', '')

    // skip the readme in the root of the repository
    if (relativePath === '/README') continue

    const toc = node.tableOfContents.replace('#', relativePath)

    articles.push({
      title: node.headings[0]?.value ?? 'No h1 found in .md file',
      toc,
    })
  }

  return (
    <Providers>
      <CMS.SEO />
      <NavBar />
      <Main>
        <h1>User Guide</h1>
        {articles.map(article => (
          <div>
            <h2>{article.title}</h2>
            <div dangerouslySetInnerHTML={{ __html: article.toc }} />
          </div>
        ))}
      </Main>
    </Providers>
  )
}

interface Data {
  allMarkdownRemark: {
    nodes: {
      tableOfContents: string
      fileAbsolutePath: string
      headings: {
        value: string
      }[]
    }[]
  }
}

export const query = graphql`
  {
    allMarkdownRemark {
      nodes {
        tableOfContents(absolute: false)
        fileAbsolutePath
        headings(depth: h1) {
          value
        }
      }
    }
  }
`

export default UserGuidePage
