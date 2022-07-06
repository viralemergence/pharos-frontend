import React, { useEffect, useRef } from 'react'
import styled from 'styled-components'

import { View } from 'components/Login/UserContextProvider'
import MintButton from 'components/ui/MintButton'
import Label from 'components/ui/InputLabel'
import Input from 'components/ui/Input'

import useUser from 'hooks/useUser'

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
  const [_, setUser] = useUser()

  useEffect(() => {
    firstInputRef.current?.focus()
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setUser(prev => ({ ...prev, view: View.datagrid }))
  }

  return (
    <Form onSubmit={e => handleSubmit(e)}>
      <H1>Create Dataset</H1>
      <Label>
        Dataset Name
        <Input type="text" ref={firstInputRef} />
      </Label>
      <Label>
        Collection Date
        <Input type="date" />
      </Label>
      <MintButton type="submit" style={{ marginLeft: 'auto' }}>
        Create
      </MintButton>
    </Form>
  )
}

export default CreateDatasetForm
