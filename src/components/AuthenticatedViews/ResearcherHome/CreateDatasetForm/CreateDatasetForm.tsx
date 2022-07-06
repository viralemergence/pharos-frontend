import React, { useEffect, useRef } from 'react'
import styled from 'styled-components'

import MintButton from 'components/ui/MintButton'
import Label from 'components/ui/InputLabel'
import Input from 'components/ui/Input'

import { useNavigate } from 'react-router-dom'
import createDataset from './createDataset'
import useUser from 'hooks/useUser'
import useDatasets from 'hooks/useDatasetList'

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

  const [user] = useUser()
  const navigate = useNavigate()
  const [_, setDatasets] = useDatasets()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const target = e.target as typeof e.target & {
      dataset_name: { value: string }
      date_collected: { value: string }
    }

    if (!user.data) return false

    const created = await createDataset(
      user.data.researcherID,
      target.dataset_name.value,
      target.date_collected.value,
      0,
      0
    )

    console.log(created)

    if (created) {
      setDatasets(prev => [...prev, created])
      navigate(`/dataset/${created.datasetID}`)
    }
    // else throw new Error('dataset creation failed')
  }

  return (
    <Form onSubmit={e => handleSubmit(e)}>
      <H1>Create Dataset</H1>
      <Label>
        Dataset Name
        <Input type="text" name="dataset_name" ref={firstInputRef} />
      </Label>
      <Label>
        Collection Date
        <Input type="date" name="date_collected" />
      </Label>
      <MintButton type="submit" style={{ marginLeft: 'auto' }}>
        Create
      </MintButton>
    </Form>
  )
}

export default CreateDatasetForm
