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
