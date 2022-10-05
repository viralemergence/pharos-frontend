import saveDataset from 'api/saveDataset'
import useDataset from 'hooks/dataset/useDataset'
import useDatasetID from 'hooks/dataset/useDatasetID'
import useProjectDispatch from 'hooks/project/useProjectDispatch'
import useUser from 'hooks/useUser'
import { ProjectActions } from 'reducers/projectReducer/projectReducer'
import { Dataset, DatasetStatus } from 'reducers/projectReducer/types'

const useDoSaveDataset = () => {
  const projectDispatch = useProjectDispatch()
  const user = useUser()

  const doSaveDataset = async (dataset: Dataset) => {
    if (dataset.status !== DatasetStatus.Unsaved || !user.data?.researcherID)
      return null

    console.log('Do Action: Save Dataset')
    projectDispatch({
      type: ProjectActions.SetDatasetStatus,
      payload: {
        datasetID: dataset.datasetID,
        status: DatasetStatus.Saving,
      },
    })

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
          datasetID: dataset.datasetID,
          status: DatasetStatus.Saved,
        },
      })
    } else {
      projectDispatch({
        type: ProjectActions.SetDatasetStatus,
        payload: {
          datasetID: dataset.datasetID,
          status: DatasetStatus.Error,
        },
      })
    }
  }

  return doSaveDataset
}

export default useDoSaveDataset
