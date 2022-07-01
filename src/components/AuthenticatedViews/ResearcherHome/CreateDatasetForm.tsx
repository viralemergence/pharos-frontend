import React, { useState } from 'react'
import styled from 'styled-components'

const Form = styled.form`
  width: 500px;
  max-width: 90%;
  min-height: 300px;
`
const Input = styled.input`
  width: 100%;
  padding: 10px 20px;
  background: ${({ theme }) => theme.veryLightGray};
  color: ${({ theme }) => theme.darkPurpleWhiter};
  border-radius: 3px;
  font-size: 20px;
  margin: 0;
  margin-bottom: 20px;
`
const Label = styled.label`
  ${({ theme }) => theme.smallParagraph}
`
const SubmitButton = styled.button`
  ${({ theme }) => theme.smallParagraph}
  border: none;
  background: none;
  padding: 10px 20px;
  background-color: ${({ theme }) => theme.mint};
  margin-top: 60px;
`
const CreateDatasetForm = () => {
  return (
    <Form>
      <h1>Create Dataset</h1>
      <Label>
        Dataset Name
        <Input type="text" />
      </Label>
      <Label>
        Collection Date
        <Input type="text" />
      </Label>
      <SubmitButton onClick={e => e.preventDefault()} type="submit">
        Create
      </SubmitButton>
    </Form>
  )
}

export default CreateDatasetForm
