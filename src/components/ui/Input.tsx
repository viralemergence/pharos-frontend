import styled from 'styled-components'

const Input = styled.input`
  border: none;
  border: 1px solid ${({ theme }) => theme.darkPurple};
  border-radius: 5px;
  width: 100%;
  padding: 10px 20px;
  margin-top: 5px;
  background: ${({ theme }) => theme.veryLightGray};
  color: ${({ theme }) => theme.darkPurpleWhiter};
  font-size: 20px;
`

export default Input
