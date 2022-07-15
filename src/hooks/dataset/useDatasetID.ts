import { useParams } from 'react-router-dom'

// take dataset ID from url params
// and throw error if it is undefined
const useDatasetID = () => {
  const { datasetID } = useParams()
  if (!datasetID) throw new Error('Dataset ID not found in url params')

  return datasetID
}

export default useDatasetID
