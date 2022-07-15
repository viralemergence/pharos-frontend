import { datasetInitialValue } from 'reducers/projectReducer/projectReducer'
import useProject from '../project/useProject'
import useDatasetID from './useDatasetID'

const useDataset = () => {
  const project = useProject()
  const datasetID = useDatasetID()

  return project.datasets[datasetID] ?? datasetInitialValue
}

export default useDataset
