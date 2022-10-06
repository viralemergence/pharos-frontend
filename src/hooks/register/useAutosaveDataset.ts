import saveDataset from 'api/saveDataset'
import useDataset from 'hooks/dataset/useDataset'
import useDatasetID from 'hooks/dataset/useDatasetID'
import useDispatch from 'hooks/useDispatch'
import useUser from 'hooks/useUser'
import { useEffect } from 'react'
import { ProjectActions } from 'reducers/projectReducer/projectReducer'
import { DatasetStatus } from 'reducers/projectReducer/types'

const useAutosaveDataset = () => {
  const projectDispatch = useDispatch()
  const datasetID = useDatasetID()
  const dataset = useDataset()
  const user = useUser()

  useEffect(() => {
    const save = async () => {
      if (dataset.status !== DatasetStatus.Unsaved || !user.data?.researcherID)
        return null

      projectDispatch({
        type: ProjectActions.SetDatasetStatus,
        payload: {
          datasetID,
          status: DatasetStatus.Saving,
        },
      })

      console.log('API Sync: Save Dataset')
      // omit register, save everything else to the server
      const datasetSaveData = { ...dataset }
      delete datasetSaveData.registerStatus
      delete datasetSaveData.register
      delete datasetSaveData.status

      console.log(datasetSaveData)

      const saved = await saveDataset(datasetSaveData)

      if (saved) {
        projectDispatch({
          type: ProjectActions.SetDatasetStatus,
          payload: {
            datasetID,
            status: DatasetStatus.Saved,
          },
        })
      } else {
        projectDispatch({
          type: ProjectActions.SetDatasetStatus,
          payload: {
            datasetID,
            status: DatasetStatus.Error,
          },
        })
      }
    }

    save()
  }, [datasetID, dataset, projectDispatch, user.data?.researcherID])
}

export default useAutosaveDataset
