import styled from 'styled-components'

const Input = styled.input`
  border: none;
  border: 2px solid ${({ theme }) => theme.darkPurple};
  width: 100%;
  padding: 10px 20px;
  background: ${({ theme }) => theme.veryLightGray};
  color: ${({ theme }) => theme.darkPurpleWhiter};
  font-size: 20px;
`

export default Input
