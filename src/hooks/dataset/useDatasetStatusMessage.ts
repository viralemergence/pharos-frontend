import { DatasetStatus, RegisterStatus } from 'reducers/projectReducer/types'
import useDataset from './useDataset'

const useDatasetStatusMessage = () => {
  const dataset = useDataset()

  if (!dataset) return 'No dataset'

  const registerStatus = dataset.registerStatus

  let datasetStatusMessage

  switch (true) {
    case registerStatus === RegisterStatus.Loading:
      datasetStatusMessage = 'Loading register'
      break
    case dataset.status === DatasetStatus.Saved &&
      registerStatus === RegisterStatus.Saved:
      datasetStatusMessage = 'Dataset saved'
      break
    case dataset.status === DatasetStatus.Saving ||
      registerStatus === RegisterStatus.Saving:
      datasetStatusMessage = 'Saving...'
      break
    case dataset.status === DatasetStatus.Unsaved ||
      registerStatus === RegisterStatus.Unsaved:
      datasetStatusMessage = 'Not saved'
      break
    case dataset.status === DatasetStatus.Error ||
      registerStatus === RegisterStatus.Error:
      datasetStatusMessage = 'Error'
      break
    default:
      datasetStatusMessage = ' Unknown Error'
  }

  return datasetStatusMessage
}

export default useDatasetStatusMessage
