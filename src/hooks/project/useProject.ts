import { projectInitialValue } from 'reducers/projectReducer/projectReducer'
import useProjectID from './useProjectID'
import useProjects from './useProjects'

const useProject = () => {
  const projects = useProjects()
  const projectID = useProjectID()

  const project = projects[projectID] ?? projectInitialValue

  return project
}

export default useProject
