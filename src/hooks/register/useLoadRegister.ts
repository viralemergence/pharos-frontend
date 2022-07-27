import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import useUser from 'hooks/useUser'
import useDataset from 'hooks/dataset/useDataset'
import useProject from 'hooks/project/useProject'
import useProjectDispatch from 'hooks/project/useProjectDispatch'

import {
  DatasetStatus,
  ProjectStatus,
  RegisterStatus,
} from 'reducers/projectReducer/types'
import { ProjectActions } from 'reducers/projectReducer/projectReducer'

import loadRegister from 'api/loadRegister'

const useLoadRegister = () => {
  console.log('useLoadRegister')
  const user = useUser()
  const dataset = useDataset()
  const navigate = useNavigate()
  const project = useProject()
  const projectDispatch = useProjectDispatch()

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
        registerStatus === RegisterStatus.Loaded
      ) {
        console.log('short circuit')
        return null
      }

      // if the register contains rows, we don't need to check
      // this might need to change in a multi-user context
      if (register && Object.keys(register).length !== 0) return null

      const nextRegisterData = await loadRegister({
        researcherID: user.data.researcherID,
        datasetID,
      })

      if (nextRegisterData) {
        const { register, versions } = nextRegisterData

        projectDispatch({
          type: ProjectActions.ReplaceRegister,
          payload: { datasetID, register },
        })

        projectDispatch({
          type: ProjectActions.SetVersions,
          payload: { datasetID, versions },
        })

        projectDispatch({
          type: ProjectActions.SetRegisterStatus,
          payload: { datasetID, status: RegisterStatus.Loaded },
        })
      } else {
        projectDispatch({
          type: ProjectActions.SetRegisterStatus,
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
