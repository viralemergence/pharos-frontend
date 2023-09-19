import React, { useState } from 'react'
import styled from 'styled-components'

import MintButton from 'components/ui/MintButton'
import Label from 'components/ui/InputLabel'
import Input from 'components/ui/Input'

import useDispatch from 'hooks/useDispatch'
import { StateActions } from 'reducers/stateReducer/stateReducer'
import getTimestamp from 'utilities/getTimestamp'
import useModal from 'hooks/useModal/useModal'
import useProjectID from 'hooks/project/useProjectID'
import { useNavigate } from 'react-router-dom'
import generateID from 'utilities/generateID'
import { datasetInitialValue } from 'reducers/stateReducer/initialValues'

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
  margin-bottom: 0;
`

const CreateDatasetForm = () => {
  const dispatch = useDispatch()
  const setModal = useModal()
  const projectID = useProjectID()
  const datasetID = generateID.datasetID()

  const navigate = useNavigate()

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

    dispatch({
      type: StateActions.CreateDataset,
      payload: {
        timestamp: getTimestamp(),
        projectID,
        dataset: {
          ...datasetInitialValue,
          datasetID,
          projectID,
          name: target.name.value,
        },
      },
    })

    setModal(null)
    navigate(`/projects/${projectID}/${datasetID}`)
  }

  return (
    <Form onSubmit={handleSubmit}>
      <H1>Create dataset</H1>
      <Label style={{ marginTop: 10 }}>
        Dataset Name
        <Input type="text" name="name" autoFocus />
      </Label>
      <p style={{ margin: 0, padding: 0 }}>{formMessage}</p>
      <MintButton type="submit" style={{ marginRight: 'auto' }}>
        Create
      </MintButton>
    </Form>
  )
}

export default CreateDatasetForm
