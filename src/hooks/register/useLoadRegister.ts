import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import useUser from 'hooks/useUser'
import useDataset from 'hooks/dataset/useDataset'
import useState from 'hooks/project/useProject'
import useDispatch from 'hooks/useDispatch'

import {
  DatasetStatus,
  ProjectStatus,
  RegisterStatus,
} from 'reducers/projectReducer/types'
import { StateActions } from 'reducers/projectReducer/stateReducer'

import loadRegister from 'api/loadRegister'

const useLoadRegister = () => {
  const user = useUser()
  const dataset = useDataset()
  const navigate = useNavigate()
  const project = useState()
  const projectDispatch = useDispatch()

  const { datasetID, register, registerStatus } = dataset

  useEffect(() => {
    // handle case where the page loads on a dataset that doesn't exist
    if (
      project.status === ProjectStatus.Loaded &&
      dataset.status === DatasetStatus.Loading
    )
      navigate('/')

    const requestRegister = async () => {
      if (
        // if user data is undefined we can't check
        !user.data?.researcherID ||
        // can't check if datasetID is empty
        datasetID === '' ||
        // if register is loaded we don't need to check
        registerStatus === RegisterStatus.Loaded ||
        // if register is in an error state, don't retry
        dataset.registerStatus === RegisterStatus.Error
      ) {
        return null
      }

      // if the register contains rows, we don't need to check
      // this might need to change in a multi-user context
      if (register && Object.keys(register).length !== 0) return null

      console.log('API Sync: Request Register')
      const nextRegisterData = await loadRegister({
        researcherID: user.data.researcherID,
        datasetID,
      })

      if (nextRegisterData) {
        projectDispatch({
          type: StateActions.ReplaceRegister,
          payload: { datasetID, register: nextRegisterData },
        })

        projectDispatch({
          type: StateActions.SetRegisterStatus,
          payload: { datasetID, status: RegisterStatus.Saved },
        })
      } else {
        projectDispatch({
          type: StateActions.SetRegisterStatus,
          payload: { datasetID, status: RegisterStatus.Error },
        })
      }
    }

    requestRegister()
  }, [
    dataset,
    navigate,
    register,
    datasetID,
    registerStatus,
    project.status,
    projectDispatch,
    user.data?.researcherID,
  ])
}

export default useLoadRegister
