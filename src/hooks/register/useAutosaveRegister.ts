import saveRegister from 'api/saveRegister'
import useDataset from 'hooks/dataset/useDataset'
import useDatasetID from 'hooks/dataset/useDatasetID'
import useProjectDispatch from 'hooks/project/useProjectDispatch'
import useUser from 'hooks/useUser'
import { useEffect } from 'react'
import { ProjectActions } from 'reducers/projectReducer/projectReducer'
import { RegisterStatus } from 'reducers/projectReducer/types'

const useAutosaveRegister = () => {
  const projectDispatch = useProjectDispatch()
  const datasetID = useDatasetID()
  const dataset = useDataset()
  const user = useUser()

  useEffect(() => {
    console.log(dataset.registerStatus)
    const save = async () => {
      console.log('AUTOSAVE')

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

      const saved = await saveRegister({
        datasetID,
        researcherID: user.data.researcherID,
        data: { register: dataset.register, versions: dataset.versions },
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
