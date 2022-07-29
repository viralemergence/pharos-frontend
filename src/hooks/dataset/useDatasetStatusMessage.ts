import { DatasetStatus, RegisterStatus } from 'reducers/projectReducer/types'
import useDataset from './useDataset'

const useDatasetStatusMessage = () => {
  const dataset = useDataset()

  if (!dataset) return 'No dataset'

  const registerStatus = dataset.registerStatus

  console.log(
    dataset.status === DatasetStatus.Saved &&
      registerStatus === RegisterStatus.Loaded
  )

  let datasetStatusMessage
  switch (true) {
    case dataset.status === DatasetStatus.Saved &&
      registerStatus === RegisterStatus.Saved:
      datasetStatusMessage = 'Dataset saved'
      break
    case registerStatus === RegisterStatus.Loading:
      datasetStatusMessage = 'Loading register'
      break
    case dataset.status === DatasetStatus.Saving ||
      registerStatus === RegisterStatus.Saving:
      datasetStatusMessage = 'Saving...'
      break
    case dataset.status === DatasetStatus.Unsaved ||
      registerStatus === RegisterStatus.Unsaved:
      datasetStatusMessage = 'Dataset not saved'
      break
    case dataset.status === DatasetStatus.Error:
      datasetStatusMessage = 'Error'
  }

  return datasetStatusMessage
}

export default useDatasetStatusMessage
