import styled from 'styled-components'

const Textarea = styled.textarea`
  border: none;
  border: 1px solid ${({ theme }) => theme.darkPurple};
  border-radius: 5px;
  width: 100%;
  max-width: 100%;
  min-width: 100%;
  padding: 10px 20px;
  margin-top: 5px;
  background: ${({ theme }) => theme.veryLightGray};
  color: ${({ theme }) => theme.black};
  ${({ theme }) => theme.smallParagraph};
  height: 120px;

  &::placeholder {
    color: ${({ theme }) => theme.darkGray};
  }
`

export default Textarea
