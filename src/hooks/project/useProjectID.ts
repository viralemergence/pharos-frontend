import { useParams } from 'react-router-dom'

// take dataset ID from url params
// and throw error if it is undefined
const useProjectID = () => {
  const { projectID } = useParams()
  if (!projectID) throw new Error('Project ID not found in url params')

  return projectID
}

export default useProjectID
