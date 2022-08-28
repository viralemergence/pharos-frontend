import React, { useState } from 'react'
import styled from 'styled-components'

import MintButton from 'components/ui/MintButton'
import Label from 'components/ui/InputLabel'
import Input from 'components/ui/Input'

import useDoCreateDataset from 'reducers/projectReducer/hooks/useDoCreateDataset'

const Form = styled.form`
  width: 500px;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 0 15px 15px 15px;
`
const H1 = styled.h1`
  ${({ theme }) => theme.h3}
`

const CreateDatasetForm = () => {
  const doCreateDataset = useDoCreateDataset()

  const [formMessage, setFormMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const target = e.target as typeof e.target & {
      name: { value: string }
    }

    if (!target.name.value) {
      setFormMessage('Please enter dataset name')
      return null
    }

    doCreateDataset({ name: target.name.value })
  }

  return (
    <Form onSubmit={handleSubmit}>
      <H1>Create Dataset</H1>
      <Label>
        Dataset Name
        <Input type="text" name="name" autoFocus />
      </Label>
      <p style={{ margin: 0, padding: 0 }}>{formMessage}</p>
      <MintButton type="submit" style={{ marginLeft: 'auto' }}>
        Create
      </MintButton>
    </Form>
  )
}

export default CreateDatasetForm
