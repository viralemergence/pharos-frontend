import React from 'react'
import styled from 'styled-components'
import { graphql } from 'gatsby'

import Providers from 'components/layout/Providers'
import NavBar from 'components/layout/NavBar/NavBar'
import Main from 'components/layout/Main'
import { baseStyle } from './styles'

const Content = styled.div`
  ${baseStyle}
`

const DocsDefault = ({ data }: { data: Data }) => {
  return (
    <Providers>
      <NavBar />
      <Main>
        <Content
          dangerouslySetInnerHTML={{ __html: data.markdownRemark.html }}
        />
      </Main>
    </Providers>
  )
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

export default DocsDefault
