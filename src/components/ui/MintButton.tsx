import styled, { css } from 'styled-components'
import { lighten } from 'polished'
import { Link } from 'gatsby'

const buttonStyle = css<{ secondary?: boolean }>`
  border: none;
  background: none;
  margin: 0;
  ${({ theme }) => theme.smallParagraph}
  color: ${({ theme }) => theme.black};
  border: 2px solid;
  border-color: ${({ theme }) => theme.mint};
  padding: 10px 20px;

  background-color: ${({ theme, secondary }) =>
    secondary ? 'white' : theme.mint};

  transition: 150ms ease;

  display: flex;
  align-items: center;

  &:hover {
    background: ${({ theme }) => lighten(0.07, theme.mint)};
  }
`

const MintButton = styled.button<{ secondary?: boolean }>`
  ${buttonStyle};
`

export const MintButtonLink = styled(Link)<{ secondary?: boolean }>`
  ${buttonStyle};
`

export default MintButton
