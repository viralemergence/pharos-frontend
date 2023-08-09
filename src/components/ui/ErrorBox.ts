import styled from 'styled-components'

const ErrorBox = styled.div`
  ${({ theme }) => theme.smallParagraph};
  color: inherit;
  font-family: monospace;
`

export default ErrorBox
