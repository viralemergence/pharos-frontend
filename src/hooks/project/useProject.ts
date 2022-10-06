import { useContext } from 'react'
import { ProjectContext } from 'reducers/projectReducer/projectContext'
import { projectInitialValue } from 'reducers/projectReducer/projectReducer'
import useProjectID from './useProjectID'

const useAppState = () => {
  const context = useContext(ProjectContext)
  const projectID = useProjectID()

  // some error handling here so we know context is defined
  if (!context) throw new Error('Project context not found')

  const project = context.state.projects[projectID]

  return project
}

export default useAppState
