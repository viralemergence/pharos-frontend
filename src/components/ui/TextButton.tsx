import styled from 'styled-components'

const TextButton = styled.button<{ primary?: boolean; small?: boolean }>`
  ${({ theme, small }) =>
    small ? theme.extraSmallParagraph : theme.smallParagraph};

  margin: 0;
  background: none;
  border: none;
  color: ${({ theme, primary }) => (primary ? theme.link : theme.veryDarkGray)};

  transition: 150ms ease;
  &:hover {
    color: ${({ theme, primary }) => (primary ? theme.black : theme.link)};
  }
`

export default TextButton
