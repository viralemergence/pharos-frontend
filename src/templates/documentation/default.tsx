import React from 'react'
import styled from 'styled-components'
import { graphql } from 'gatsby'

import Providers from 'components/layout/Providers'
import NavBar from 'components/layout/NavBar/NavBar'
import Main from 'components/layout/Main'

const Content = styled.div`
  max-width: 1000px;
  width: 100%;
  margin: auto;

  h1 {
    ${({ theme }) => theme.h1}
  }

  h2 {
    ${({ theme }) => theme.h2}
  }

  h3 {
    ${({ theme }) => theme.h3}
  }

  p {
    ${({ theme }) => theme.bigParagraph}
  }

  table {
    width: 100%;
    border-collapse: collapse;

    th {
      text-align: left;
      background-color: rgba(170, 233, 220, 0.33);
      border-bottom: thin solid rgba(170, 233, 220, 1);

      &:first-of-type {
        border-top-left-radius: 10px;
      }
      &:last-of-type {
        border-top-right-radius: 10px;
      }
    }

    th,
    td {
      padding: 12px 15px;
    }

    tr {
      border-bottom: thin solid #dddddd;
    }

    tr:nth-child(odd) > td {
      background-color: rgba(0, 0, 0, 0.05);
    }
  }
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
