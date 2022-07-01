import styled from 'styled-components'
import { lighten } from 'polished'

const SubmitButton = styled.button`
  border: none;
  background: none;
  margin: 0;
  ${({ theme }) => theme.smallParagraph}
  background-color: ${({ theme }) => theme.mint};
  padding: 10px 20px;

  transition: 150ms ease;

  &:hover {
    background: ${({ theme }) => lighten(0.07, theme.mint)};
  }
`

export default SubmitButton
