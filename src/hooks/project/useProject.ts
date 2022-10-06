import useAppState from 'hooks/useAppState'
import useProjectID from './useProjectID'

const useProject = () => {
  const state = useAppState()
  const projectID = useProjectID()

  return state.projects[projectID]
}

export default useProject
