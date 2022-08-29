import { useNavigate } from 'react-router-dom'

import useProjectDispatch from 'hooks/project/useProjectDispatch'
import useModal from 'hooks/useModal/useModal'
import useUser from 'hooks/useUser'

import generateID from 'utilities/generateID'

import { DatasetStatus, RegisterStatus } from '../types'
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
    }

    const datasetClientData = {
      status: DatasetStatus.Unsaved,
      registerStatus: RegisterStatus.Unsaved,
      activeVersion: 0,
      register: {
        [generateID.recordID()]: {
          'Row ID': {
            displayValue: '',
            dataValue: '',
            version: '0',
            modifiedBy: researcherID,
          },
          'Test ID': {
            displayValue: '',
            dataValue: '',
            version: '0',
            modifiedBy: researcherID,
          },
          'Sample ID': {
            displayValue: '',
            dataValue: '',
            version: '0',
            modifiedBy: researcherID,
          },
          'Animal ID or nickname': {
            displayValue: '',
            dataValue: '',
            version: '0',
            modifiedBy: researcherID,
          },
          'Host species': {
            displayValue: '',
            dataValue: '',
            version: '0',
            modifiedBy: researcherID,
          },
          'Host NCBI Tax ID': {
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
          'Collection date': {
            displayValue: '',
            dataValue: '',
            version: '0',
            modifiedBy: researcherID,
          },
          'Collection method or tissue': {
            displayValue: '',
            dataValue: '',
            version: '0',
            modifiedBy: researcherID,
          },
          'Detection method': {
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
          'Detection target NCBI Tax ID': {
            displayValue: '',
            dataValue: '',
            version: '0',
            modifiedBy: researcherID,
          },
          'Detection measurement': {
            displayValue: '',
            dataValue: '',
            version: '0',
            modifiedBy: researcherID,
          },
          'Detection outcome': {
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
          'Detection comments': {
            displayValue: '',
            dataValue: '',
            version: '0',
            modifiedBy: researcherID,
          },
          'Organism sex': {
            displayValue: '',
            dataValue: '',
            version: '0',
            modifiedBy: researcherID,
          },
          'Dead or alive': {
            displayValue: '',
            dataValue: '',
            version: '0',
            modifiedBy: researcherID,
          },
          'Health notes': {
            displayValue: '',
            dataValue: '',
            version: '0',
            modifiedBy: researcherID,
          },
          'Life stage': {
            displayValue: '',
            dataValue: '',
            version: '0',
            modifiedBy: researcherID,
          },
          Age: {
            displayValue: '',
            dataValue: '',
            version: '0',
            modifiedBy: researcherID,
          },
          'Age units': {
            displayValue: '',
            dataValue: '',
            version: '0',
            modifiedBy: researcherID,
          },
          Mass: {
            displayValue: '',
            dataValue: '',
            version: '0',
            modifiedBy: researcherID,
          },
          'Mass units': {
            displayValue: '',
            dataValue: '',
            version: '0',
            modifiedBy: researcherID,
          },
          Length: {
            displayValue: '',
            dataValue: '',
            version: '0',
            modifiedBy: researcherID,
          },
          'Length units': {
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
