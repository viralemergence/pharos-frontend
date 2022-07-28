import styled from 'styled-components'
import { lighten } from 'polished'

const MintButton = styled.button<{ secondary?: boolean }>`
  border: none;
  background: none;
  margin: 0;
  ${({ theme }) => theme.smallParagraph}
  border: 1px solid;
  background-color: ${({ theme, secondary }) =>
    secondary ? 'white' : theme.mint};
  border-color: ${({ theme }) => theme.mint};
  padding: 10px 20px;

  transition: 150ms ease;

  &:hover {
    background: ${({ theme }) => lighten(0.07, theme.mint)};
  }
`

export default MintButton
