import { useNavigate } from 'react-router-dom'

import useProjectDispatch from 'hooks/project/useProjectDispatch'
import useModal from 'hooks/useModal/useModal'
import useUser from 'hooks/useUser'

import generateID from 'utilities/generateID'

import { DatasetDisplayStatus, DatasetStatus, RegisterStatus } from '../types'
import { ProjectActions } from '../projectReducer'
import useProjectID from 'hooks/project/useProjectID'
import getTimestamp from 'utilities/getTimestamp'

const useDoCreateDataset = () => {
  const user = useUser()
  const projectDispatch = useProjectDispatch()
  const setModal = useModal()
  const navigate = useNavigate()
  const projectID = useProjectID()

  if (!user.data) throw new Error('User not logged in')

  const {
    data: { researcherID },
  } = user

  const datasetID = generateID.datasetID()

  const doCreateDataset = ({ name }: { name: string }) => {
    const datasetSaveData = {
      name,
      datasetID,
      researcherID,
      samples_taken: '0',
      detection_run: '0',
      versions: [],
      highestVersion: 0,
      lastUpdated: getTimestamp(),
      displayStatus: DatasetDisplayStatus.Unreleased,
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
            modifiedBy: researcherID,
          },
          'Animal ID': {
            displayValue: '',
            dataValue: '',
            version: '0',
            modifiedBy: researcherID,
          },
          'Animal nickname': {
            displayValue: '',
            dataValue: '',
            version: '0',
            modifiedBy: researcherID,
          },
          Host: {
            displayValue: '',
            dataValue: '',
            version: '0',
            modifiedBy: researcherID,
          },
          'Collection Date': {
            displayValue: '',
            dataValue: '',
            version: '0',
            modifiedBy: researcherID,
          },
          Latitude: {
            displayValue: '',
            dataValue: '',
            version: '0',
            modifiedBy: researcherID,
          },
          Longitude: {
            displayValue: '',
            dataValue: '',
            version: '0',
            modifiedBy: researcherID,
          },
          'Spatial uncertainty': {
            displayValue: '',
            dataValue: '',
            version: '0',
            modifiedBy: researcherID,
          },
          'Collection Method or Tissue': {
            displayValue: '',
            dataValue: '',
            version: '0',
            modifiedBy: researcherID,
          },
          'Detection Method': {
            displayValue: '',
            dataValue: '',
            version: '0',
            modifiedBy: researcherID,
          },
          'Detection Outcome': {
            displayValue: '',
            dataValue: '',
            version: '0',
            modifiedBy: researcherID,
          },
          'Detection target': {
            displayValue: '',
            dataValue: '',
            version: '0',
            modifiedBy: researcherID,
          },
          'Target CBCI Tax ID': {
            displayValue: '',
            dataValue: '',
            version: '0',
            modifiedBy: researcherID,
          },
          Pathogen: {
            displayValue: '',
            dataValue: '',
            version: '0',
            modifiedBy: researcherID,
          },
          'Pathogen NCBI Tax ID': {
            displayValue: '',
            dataValue: '',
            version: '0',
            modifiedBy: researcherID,
          },
          'GenBank Accession': {
            displayValue: '',
            dataValue: '',
            version: '0',
            modifiedBy: researcherID,
          },
          'Detection Comments': {
            displayValue: '',
            dataValue: '',
            version: '0',
            modifiedBy: researcherID,
          },
        },
      },
    }

    projectDispatch({
      type: ProjectActions.CreateDataset,
      payload: {
        updated: getTimestamp(),
        dataset: {
          ...datasetSaveData,
          ...datasetClientData,
        },
      },
    })

    setModal(null)

    navigate(`/projects/${projectID}/${datasetID}`)
  }

  return doCreateDataset
}

export default useDoCreateDataset
