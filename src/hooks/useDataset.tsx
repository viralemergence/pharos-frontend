import useProject from './useProject'
import useDatasetID from './useDatasetID'

const useDataset = () => {
  const [project] = useProject()
  const datasetID = useDatasetID()

  return project.datasets[datasetID]
}

export default useDataset
