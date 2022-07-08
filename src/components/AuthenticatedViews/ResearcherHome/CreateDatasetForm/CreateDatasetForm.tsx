import React, { useState } from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'

import { DatasetsActions } from 'reducers/datasetsReducer/datasetsReducer'
import { DatasetStatus } from 'reducers/datasetsReducer/types'

import MintButton from 'components/ui/MintButton'
import Label from 'components/ui/InputLabel'
import Input from 'components/ui/Input'

import useUser from 'hooks/useUser'
import useDatasets from 'hooks/useDatasets'

import saveDataset from 'api/saveDataset'

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
  const [user] = useUser()
  const [datasets, datasetsDispatch] = useDatasets()

  // generate a new datesetID to use
  const [newDatasetID] = useState(String(new Date().getTime()))

  const navigate = useNavigate()

  const newDatasetStatus = datasets.datasets[newDatasetID]?.status

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
    datasetID: string
  ) => {
    e.preventDefault()

    const target = e.target as typeof e.target & {
      name: { value: string }
      date_collected: { value: string }
    }

    if (!user.data) throw new Error('User not logged in')

    const payload = {
      datasetID,
      researcherID: user.data.researcherID,
      name: target.name.value,
      date_collected: target.date_collected.value,
      samples_taken: '0',
      detection_run: '0',
      activeVersion: 0,
      status: DatasetStatus.Saving,
    }

    datasetsDispatch({
      type: DatasetsActions.CreateDataset,
      payload,
    })

    // now that we can handle this, just navigate
    // straight to the dataset directly
    navigate(`/dataset/${datasetID}`)

    const saved = await saveDataset(payload)

    if (saved) {
      datasetsDispatch({
        type: DatasetsActions.SetDatasetStatus,
        payload: {
          datasetID,
          status: DatasetStatus.Saved,
        },
      })
    } else {
      datasetsDispatch({
        type: DatasetsActions.SetDatasetStatus,
        payload: {
          datasetID,
          status: DatasetStatus.Error,
        },
      })
    }
  }

  return (
    <Form onSubmit={e => handleSubmit(e, newDatasetID)}>
      <H1>Create Dataset</H1>
      <Label>
        Dataset Name
        <Input type="text" name="name" autoFocus />
      </Label>
      <Label>
        Collection Date
        <Input type="date" name="date_collected" />
      </Label>
      <MintButton
        type="submit"
        style={{ marginLeft: 'auto' }}
        disabled={
          newDatasetStatus === DatasetStatus.Saving ||
          newDatasetStatus === DatasetStatus.Error
        }
      >
        {newDatasetStatus === DatasetStatus.Saving ? 'Submitting...' : 'Create'}
      </MintButton>
      {newDatasetStatus === DatasetStatus.Error && (
        <p>There was an error creating the dataset</p>
      )}
    </Form>
  )
}

export default CreateDatasetForm
