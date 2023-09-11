import styled from 'styled-components'

const Label = styled.label`
  ${({ theme }) => theme.extraSmallParagraph};
  color: ${({ theme }) => theme.black};
  display: block;
  margin-bottom: 15px;
`

export default Label
