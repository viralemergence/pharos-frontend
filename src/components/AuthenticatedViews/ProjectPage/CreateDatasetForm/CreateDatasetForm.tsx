import React, { useState } from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'

import { ProjectActions } from 'reducers/projectReducer/projectReducer'
import { DatasetStatus, RegisterStatus } from 'reducers/projectReducer/types'

import MintButton from 'components/ui/MintButton'
import Label from 'components/ui/InputLabel'
import Input from 'components/ui/Input'

import useUser from 'hooks/useUser'
import useProjectID from 'hooks/project/useProjectID'
import useProjectDispatch from 'hooks/project/useProjectDispatch'

import generateID from 'utilities/generateID'
import useModal from 'hooks/useModal/useModal'

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
  const projectDispatch = useProjectDispatch()
  const projectID = useProjectID()

  const setModal = useModal()

  const [formMessage, setFormMessage] = useState('')

  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const datasetID = generateID.datasetID()

    const target = e.target as typeof e.target & {
      name: { value: string }
      date_collected: { value: string }
    }

    if (!target.name.value) {
      setFormMessage('Please enter dataset name')
      return null
    }

    if (!user.data) throw new Error('User not logged in')

    setModal(null)

    const datasetSaveData = {
      datasetID,
      researcherID: user.data.researcherID,
      name: target.name.value,
      date_collected: target.date_collected.value,
      samples_taken: '0',
      detection_run: '0',
      versions: [],
      highestVersion: 0,
    }

    const datasetClientData = {
      status: DatasetStatus.Unsaved,
      registerStatus: RegisterStatus.Unsaved,
      activeVersion: 0,
      register: {
        [generateID.recordID()]: {
          SampleID: {
            displayValue: '',
            dataValue: '',
            version: '0',
            modifiedBy: user.data?.researcherID,
          },
          'Animal ID': {
            displayValue: '',
            dataValue: '',
            version: '0',
            modifiedBy: user.data?.researcherID,
          },
          'Animal nickname': {
            displayValue: '',
            dataValue: '',
            version: '0',
            modifiedBy: user.data?.researcherID,
          },
          Host: {
            displayValue: '',
            dataValue: '',
            version: '0',
            modifiedBy: user.data?.researcherID,
          },
          'Collection Date': {
            displayValue: '',
            dataValue: '',
            version: '0',
            modifiedBy: user.data?.researcherID,
          },
          Latitude: {
            displayValue: '',
            dataValue: '',
            version: '0',
            modifiedBy: user.data?.researcherID,
          },
          Longitude: {
            displayValue: '',
            dataValue: '',
            version: '0',
            modifiedBy: user.data?.researcherID,
          },
          'Spatial uncertainty': {
            displayValue: '',
            dataValue: '',
            version: '0',
            modifiedBy: user.data?.researcherID,
          },
          'Collection Method or Tissue': {
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
          'Detection target': {
            displayValue: '',
            dataValue: '',
            version: '0',
            modifiedBy: user.data?.researcherID,
          },
          'Target CBCI Tax ID': {
            displayValue: '',
            dataValue: '',
            version: '0',
            modifiedBy: user.data?.researcherID,
          },
          Pathogen: {
            displayValue: '',
            dataValue: '',
            version: '0',
            modifiedBy: user.data?.researcherID,
          },
          'Pathogen NCBI Tax ID': {
            displayValue: '',
            dataValue: '',
            version: '0',
            modifiedBy: user.data?.researcherID,
          },
          'GenBank Accession': {
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
    navigate(`/projects/${projectID}/${datasetID}`)
  }

  return (
    <Form onSubmit={handleSubmit}>
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
      <MintButton type="submit" style={{ marginLeft: 'auto' }}>
        Create
      </MintButton>
    </Form>
  )
}

export default CreateDatasetForm
