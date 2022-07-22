import { useEffect } from 'react'

import useUser from 'hooks/useUser'
import useDataset from 'hooks/dataset/useDataset'

import loadRegister from 'api/loadRegister'
import { DatasetStatus } from 'reducers/projectReducer/types'

const useLoadRegister = () => {
  console.log('useLoadRegister')
  const user = useUser()
  const dataset = useDataset()

  useEffect(() => {
    console.log('useLoadRegister useEffect')
    const requestRegister = async () => {
      if (
        dataset.status === DatasetStatus.Loading ||
        !user.data?.researcherID
      ) {
        console.log('short circuit')
        return null
      }

      // if the register contains rows, we don't need to check
      // this might need to change in a multi-user context
      if (dataset.register && Object.keys(dataset.register).length !== 0)
        return null

      const registerData = await loadRegister({
        researcherID: user.data.researcherID,
        datasetID: dataset.datasetID,
      })

      console.log('LOAD REGISTER')
      console.log(registerData)
    }

    requestRegister()
  }, [
    dataset.status,
    dataset.datasetID,
    dataset.register,
    user.data?.researcherID,
  ])
}

export default useLoadRegister
