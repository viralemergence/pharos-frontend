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
      if (!dataset?.register || !user.data?.researcherID) return
      alert('saving register to server')
      const saved = await saveRegister({
        datasetID,
        researcherID: user.data.researcherID,
        data: { register: dataset.register, versions: dataset.versions },
      }).catch(e => console.log(e))
      if (saved) {
        // set register status to unsaved
        projectDispatch({
          type: ProjectActions.SetRegisterStatus,
          payload: {
            datasetID,
            status: RegisterStatus.Saved,
          },
        })
      }
    }
    if (dataset.registerStatus === RegisterStatus.Unsaved) save()
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
