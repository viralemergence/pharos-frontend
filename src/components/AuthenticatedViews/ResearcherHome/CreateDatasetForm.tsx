import React, { useEffect, useRef } from 'react'
import styled from 'styled-components'

import Input from 'components/ui/Input'
import MintButton from 'components/ui/MintButton'
import Label from 'components/ui/InputLabel'

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
  const firstInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    firstInputRef.current?.focus()
  }, [])

  return (
    <Form>
      <H1>Create Dataset</H1>
      <Label>
        Dataset Name
        <Input type="text" ref={firstInputRef} />
      </Label>
      <Label>
        Collection Date
        <Input type="date" />
      </Label>
      <MintButton
        onClick={e => e.preventDefault()}
        type="submit"
        style={{ marginLeft: 'auto' }}
      >
        Create
      </MintButton>
    </Form>
  )
}

export default CreateDatasetForm
