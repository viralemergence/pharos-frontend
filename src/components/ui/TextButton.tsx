import styled from 'styled-components'

const TextButton = styled.button`
  ${({ theme }) => theme.smallParagraph};
  margin: 0;
  background: none;
  border: none;
  color: ${({ theme }) => theme.black};
`

export default TextButton
