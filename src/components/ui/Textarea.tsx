import styled from 'styled-components'

const Textarea = styled.textarea`
  border: none;
  border: 2px solid ${({ theme }) => theme.darkPurple};
  width: 100%;
  padding: 10px 20px;
  margin-top: 5px;
  background: ${({ theme }) => theme.veryLightGray};
  color: ${({ theme }) => theme.darkPurpleWhiter};
  font-size: 20px;
`

export default Textarea
