import React from 'react'
import styled from 'styled-components'

import Input from 'components/ui/Input'
import MintButton from 'components/ui/MintButton'

const Form = styled.form`
  width: 500px;
  max-width: 100%;
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
      <MintButton onClick={e => e.preventDefault()} type="submit">
        Create
      </MintButton>
    </Form>
  )
}

export default CreateDatasetForm
