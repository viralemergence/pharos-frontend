import { ActionFunction, ProjectActions } from '../projectReducer'
import { Project } from '../types'

export interface SetProjectAction {
  type: ProjectActions.SetProject
  payload: Project
}

const setProject: ActionFunction<Project> = (state, payload) => ({
  ...state,
  projects: {
    ...state.projects,
    [payload.projectID]: payload,
  },
})

export default setProject
