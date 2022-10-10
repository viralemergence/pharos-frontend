import { useNavigate } from 'react-router-dom'

import useDispatch from 'hooks/useDispatch'
import useModal from 'hooks/useModal/useModal'
import useUser from 'hooks/useUser'

import generateID from 'utilities/generateID'

import { DatasetStatus, RegisterStatus } from '../types'
import { ProjectActions } from '../projectReducer'
import useProjectID from 'hooks/project/useProjectID'
import getTimestamp from 'utilities/getTimestamp'

const useDoCreateDataset = () => {
  const user = useUser()
  const dispatch = useDispatch()
  const setModal = useModal()
  const projectID = useProjectID()

  const navigate = useNavigate()

  if (!user.data) throw new Error('User not logged in')

  const {
    data: { researcherID },
  } = user

  const datasetID = generateID.datasetID()

  const doCreateDataset = async ({ name }: { name: string }) => {
    const dataset = {
      name,
      datasetID,
      researcherID,
      samples_taken: '0',
      detection_run: '0',
      versions: [],
      highestVersion: 0,
      lastUpdated: getTimestamp(),
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

    dispatch({
      type: ProjectActions.CreateDataset,
      payload: {
        timestamp: getTimestamp(),
        projectID,
        dataset,
      },
    })

    setModal(null)
    navigate(`/projects/${projectID}/${datasetID}`)
  }

  return doCreateDataset
}

export default useDoCreateDataset
