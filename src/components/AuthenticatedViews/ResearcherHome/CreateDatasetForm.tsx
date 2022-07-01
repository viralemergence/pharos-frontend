import React, { useState } from 'react'
import styled from 'styled-components'

import Input from 'components/ui/Input'
import SubmitButton from 'components/ui/SubmitButtton'

const Form = styled.form`
  width: 100%;
  max-width: 500px;
  min-height: 300px;
`
const H1 = styled.h1`
  ${({ theme }) => theme.h3}
`

const Label = styled.label`
  ${({ theme }) => theme.smallParagraph}
  display: block;
  margin-bottom: 15px;
`
const CreateDatasetForm = () => {
  return (
    <Form>
      <H1>Create Dataset</H1>
      <Label>
        Dataset Name
        <Input type="text" />
      </Label>
      <Label>
        Collection Date
        <Input type="date" />
      </Label>
      <SubmitButton onClick={e => e.preventDefault()} type="submit">
        Create
      </SubmitButton>
    </Form>
  )
}

export default CreateDatasetForm
