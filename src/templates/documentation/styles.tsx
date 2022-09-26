import { css } from 'styled-components'

export const baseStyle = css`
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
