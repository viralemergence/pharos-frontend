import { lighten } from 'polished'
import styled from 'styled-components'

const TextButton = styled.button<{ primary?: boolean; small?: boolean }>`
  ${({ theme, small }) =>
    small ? theme.extraSmallParagraph : theme.smallParagraph};

  margin: 0;
  background: none;
  border: none;
  color: ${({ theme, primary }) => (primary ? theme.link : theme.veryDarkGray)};

  transition: 500ms ease;
  border-radius: 2px;
  border: thin solid rgba(0, 0, 0, 0);

  &:hover {
    color: ${({ theme }) => theme.link};
    background-color: ${({ theme, primary }) =>
      primary ? theme.veryLightGray : 'none'};
    border: thin solid ${({ theme }) => lighten(-0.015, theme.veryLightGray)};
    transition: 150ms ease;
  }
`

export default TextButton
