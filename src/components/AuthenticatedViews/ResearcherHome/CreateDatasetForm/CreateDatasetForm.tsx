import React, { useState } from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'

import { ProjectActions } from 'reducers/projectReducer/projectReducer'
import { DatasetStatus, RegisterStatus } from 'reducers/projectReducer/types'

import MintButton from 'components/ui/MintButton'
import Label from 'components/ui/InputLabel'
import Input from 'components/ui/Input'

import useUser from 'hooks/useUser'
import useProject from 'hooks/project/useProject'

import saveDataset from 'api/saveDataset'
import useProjectDispatch from 'hooks/project/useProjectDispatch'
import saveRegister from 'api/saveRegister'

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
  const user = useUser()
  const project = useProject()
  const projectDispatch = useProjectDispatch()

  const [formMessage, setFormMessage] = useState('')

  // generate a new datesetID to use
  const [newDatasetID] = useState(String(new Date().getTime()))

  const navigate = useNavigate()

  const newDatasetStatus = project.datasets[newDatasetID]?.status

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
    datasetID: string
  ) => {
    e.preventDefault()

    const target = e.target as typeof e.target & {
      name: { value: string }
      date_collected: { value: string }
    }

    if (!target.name.value) {
      setFormMessage('Please enter dataset name')
      return null
    }

    if (!user.data) throw new Error('User not logged in')

    const datasetSaveData = {
      datasetID,
      researcherID: user.data.researcherID,
      name: target.name.value,
      date_collected: target.date_collected.value,
      samples_taken: '0',
      detection_run: '0',
      versions: [],
    }

    const datasetClientData = {
      status: DatasetStatus.Saving,
      activeVersion: 0,
      register: {
        [crypto.randomUUID()]: {
          SampleID: {
            displayValue: '',
            dataValue: '',
            version: '0',
            modifiedBy: user.data?.researcherID,
          },
          'Detection ID': {
            displayValue: '',
            dataValue: '',
            version: '0',
            modifiedBy: user.data?.researcherID,
          },
          'Organism Nickname': {
            displayValue: '',
            dataValue: '',
            version: '0',
            modifiedBy: user.data?.researcherID,
          },
          'Detection Method': {
            displayValue: '',
            dataValue: '',
            version: '0',
            modifiedBy: user.data?.researcherID,
          },
          'Detection Outcome': {
            displayValue: '',
            dataValue: '',
            version: '0',
            modifiedBy: user.data?.researcherID,
          },
          'Pathogen TaxID': {
            displayValue: '',
            dataValue: '',
            version: '0',
            modifiedBy: user.data?.researcherID,
          },
          'Detection Comments': {
            displayValue: '',
            dataValue: '',
            version: '0',
            modifiedBy: user.data?.researcherID,
          },
        },
      },
    }

    projectDispatch({
      type: ProjectActions.CreateDataset,
      payload: {
        ...datasetSaveData,
        ...datasetClientData,
      },
    })

    // now that we can handle this, just navigate
    // straight to the dataset directly
    navigate(`/dataset/${datasetID}`)

    const saved = await saveDataset(datasetSaveData)

    // save the register to the server
    const registerSaved = await saveRegister({
      datasetID,
      researcherID: user.data.researcherID,
      data: {
        register: datasetClientData.register,
        versions: [...datasetSaveData.versions],
      },
    })

    if (registerSaved) {
      projectDispatch({
        type: ProjectActions.SetRegisterStatus,
        payload: {
          datasetID,
          status: RegisterStatus.Saved,
        },
      })
    } else {
      projectDispatch({
        type: ProjectActions.SetDatasetStatus,
        payload: {
          datasetID,
          status: DatasetStatus.Error,
        },
      })
    }

    if (saved) {
      projectDispatch({
        type: ProjectActions.SetDatasetStatus,
        payload: {
          datasetID,
          status: DatasetStatus.Saved,
        },
      })
    } else {
      projectDispatch({
        type: ProjectActions.SetDatasetStatus,
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
        <Input
          type="date"
          name="date_collected"
          defaultValue={new Date().toISOString().split('T')[0]}
        />
      </Label>
      <p style={{ margin: 0, padding: 0 }}>{formMessage}</p>
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
