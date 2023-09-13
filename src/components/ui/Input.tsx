import styled from 'styled-components'

const Input = styled.input`
  border: none;
  ${({ theme }) => theme.smallParagraph}
  border: 1px solid ${({ theme }) => theme.darkPurple};
  border-radius: 5px;
  width: 100%;
  padding: 10px 15px;
  margin-top: 8px;
  background: ${({ theme }) => theme.veryLightGray};
  color: ${({ theme }) => theme.black};
  &::placeholder {
    color: ${({ theme }) => theme.darkGray};
  }
`

export default Input
