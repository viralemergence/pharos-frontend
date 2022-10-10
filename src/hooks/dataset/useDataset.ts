import { datasetInitialValue } from 'reducers/projectReducer/projectReducer'

import useDatasetID from './useDatasetID'
import useDatasets from './useDatasets'

const useDataset = () => {
  const datasetID = useDatasetID()
  const datasets = useDatasets()

  const dataset = datasets[datasetID] ?? datasetInitialValue

  return dataset
}

export default useDataset
