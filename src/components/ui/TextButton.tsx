import styled from 'styled-components'

const TextButton = styled.button<{ primary?: boolean }>`
  ${({ theme }) => theme.smallParagraph};
  margin: 0;
  background: none;
  border: none;
  color: ${({ theme, primary }) => (primary ? theme.link : theme.black)};
`

export default TextButton
