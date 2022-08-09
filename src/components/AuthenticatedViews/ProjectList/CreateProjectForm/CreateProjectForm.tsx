import React, { useState } from 'react'
import styled from 'styled-components'
import useUser from 'hooks/useUser'
import MintButton from 'components/ui/MintButton'

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

const CreateProjectForm = () => {
  const user = useUser()
  const [formMessage, setFormMessage] = useState('')

  const handleSubmit = () => {
    alert('create project')
  }

  return (
    <Form onSubmit={handleSubmit}>
      <H1>Create Project</H1>
      <p style={{ margin: 0, padding: 0 }}>{formMessage}</p>
      <MintButton type="submit" style={{ marginLeft: 'auto' }}>
        Create
      </MintButton>
    </Form>
  )
}

export default CreateProjectForm
