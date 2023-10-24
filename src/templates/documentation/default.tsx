import React from 'react'
import styled from 'styled-components'
import { graphql } from 'gatsby'

import Providers from 'components/layout/Providers'
import NavBar from 'components/layout/NavBar/NavBar'
import { baseStyle } from './styles'

import Sidebar from './Sidebar/Sidebar'

export interface PageInfo {
  id: string
  title: string
  path: string
  order: string
}

export interface SiteMap {
  [key: string]: Record<string, SiteMap> | PageInfo
}

interface DocsDefaultProps {
  data: Data
  pageContext: {
    id: string
    siteMap: SiteMap
  }
}

interface Data {
  markdownRemark: {
    html: string
  }
}

export const query = graphql`
  query ($id: String) {
    markdownRemark(id: { eq: $id }) {
      html
    }
  }
`
const Layout = styled.main`
  display: grid;
  grid-template-areas: 'sidebar article';
  max-width: 1500px;
  gap: 15px;
  padding: 15px;
  margin: auto;
`
const Content = styled.div`
  ${baseStyle}
`

const DocsDefault = ({ data, pageContext }: DocsDefaultProps): JSX.Element => (
  <Providers>
    <NavBar />
    <Layout>
      <Sidebar siteMap={pageContext.siteMap} />
      <Content dangerouslySetInnerHTML={{ __html: data.markdownRemark.html }} />
    </Layout>
  </Providers>
)

export default DocsDefault
