import { useEffect } from 'react'

import useUser from 'hooks/useUser'
import useDataset from 'hooks/dataset/useDataset'

import loadRegister from 'api/loadRegister'
import { RegisterStatus } from 'reducers/projectReducer/types'
import useProjectDispatch from 'hooks/project/useProjectDispatch'

const useLoadRegister = () => {
  console.log('useLoadRegister')
  const user = useUser()
  const dataset = useDataset()
  const projectDispatch = useProjectDispatch()

  const { datasetID, register, registerStatus } = dataset

  useEffect(() => {
    console.log('useLoadRegister useEffect')
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

      const registerData = await loadRegister({
        researcherID: user.data.researcherID,
        datasetID,
      })

      console.log('LOAD REGISTER')
      console.log(registerData)

      // once this is working, this is
      // how we'll load it in to state

      // if (registerData) {
      //   projectDispatch({
      //     type: ProjectActions.ReplaceRegister,
      //     payload: { datasetID, register: registerData },
      //   })
      //   projectDispatch({
      //     type: ProjectActions.SetRegisterStatus,
      //     payload: { datasetID, status: RegisterStatus.Loaded },
      //   })
      // } else {
      //   projectDispatch({
      //     type: ProjectActions.SetRegisterStatus,
      //     payload: { datasetID, status: RegisterStatus.Error },
      //   })
      // }
    }

    requestRegister()
  }, [
    projectDispatch,
    datasetID,
    register,
    registerStatus,
    user.data?.researcherID,
  ])
}

export default useLoadRegister
