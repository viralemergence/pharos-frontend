import saveRegister from 'api/saveRegister'
import useDataset from 'hooks/dataset/useDataset'
import useDatasetID from 'hooks/dataset/useDatasetID'
import useDispatch from 'hooks/useDispatch'
import useUser from 'hooks/useUser'
import { useEffect } from 'react'
import { ProjectActions } from 'reducers/projectReducer/projectReducer'
import { RegisterStatus } from 'reducers/projectReducer/types'

const useAutosaveRegister = () => {
  const projectDispatch = useDispatch()
  const datasetID = useDatasetID()
  const dataset = useDataset()
  const user = useUser()

  useEffect(() => {
    const save = async () => {
      if (
        dataset.registerStatus !== RegisterStatus.Unsaved ||
        !dataset?.register ||
        !user.data?.researcherID
      )
        return null

      projectDispatch({
        type: ProjectActions.SetRegisterStatus,
        payload: {
          datasetID,
          status: RegisterStatus.Saving,
        },
      })

      console.log('API Sync: Save Register')
      const saved = await saveRegister({
        datasetID,
        researcherID: user.data.researcherID,
        register: dataset.register,
      }).catch(e => console.log(e))

      if (saved) {
        projectDispatch({
          type: ProjectActions.SetRegisterStatus,
          payload: {
            datasetID,
            status: RegisterStatus.Saved,
          },
        })
      } else {
        projectDispatch({
          type: ProjectActions.SetRegisterStatus,
          payload: {
            datasetID,
            status: RegisterStatus.Error,
          },
        })
      }
    }

    save()
  }, [
    datasetID,
    projectDispatch,
    dataset.register,
    dataset.versions,
    dataset.registerStatus,
    user.data?.researcherID,
  ])
}

export default useAutosaveRegister
