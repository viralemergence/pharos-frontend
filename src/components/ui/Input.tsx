import React from 'react'
import styled from 'styled-components'

const InputElement = styled.input`
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

const Input = (props) => (<InputElement {...props} / >)

export default Input
