import styled, { css } from 'styled-components'
import { Link } from 'gatsby'

export const buttonStyle = css<{
  secondary?: boolean
  warning?: boolean
  inProgress?: boolean
}>`
  border: none;
  background: none;
  margin: 0;
  ${({ theme }) => theme.smallParagraph}
  color: ${({ theme }) => theme.black};
  border: 2px solid;
  padding: 8px 20px;
  transition: 150ms ease;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;

  ${({ theme, secondary, warning }) => {
    switch (true) {
      case secondary:
        return `
          border-color: ${theme.mint};
          background-color: ${theme.white};`
      case warning:
        return `
          border-color: ${theme.orange};
          background-color: ${theme.white};`
      default:
        return `
          border-color: ${theme.mint};
          background-color: ${theme.mint};`
    }
  }}

  &:hover {
    background: ${({ theme, secondary, warning }) => {
      switch (true) {
        case secondary:
          return theme.hoverMint
        case warning:
          return theme.hoverOrange
        default:
          return theme.hoverMint
      }
    }};
  }

  &:disabled {
    background: ${({ theme }) => theme.veryLightGray};
    border-color: ${({ theme }) => theme.veryLightGray};
    color: ${({ theme }) => theme.darkGray};

    ${({ theme, secondary, warning, inProgress }) => {
      if (inProgress) {
        switch (true) {
          case secondary:
            return `
              color: ${theme.black};
              border-color: ${theme.mint};
              background-color: ${theme.hoverMint};`
          case warning:
            return `
              color: ${theme.black};
              border-color: ${theme.orange};
              background-color: ${theme.hoverOrange};`
          default:
            return `
              color: ${theme.black};
              border-color: ${theme.mint};
              background-color: ${theme.hoverMint};`
        }
      }
    }}
  }
`

const MintButton = styled.button<{
  secondary?: boolean
  warning?: boolean
  inProgress?: boolean
}>`
  ${buttonStyle};
`

export const MintButtonLink = styled(Link)<{
  secondary?: boolean
  warning?: boolean
  inProgress?: boolean
}>`
  ${buttonStyle};
`

export default MintButton
