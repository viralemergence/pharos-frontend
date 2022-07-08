import { ActionFunction, ProjectActions } from '../projectReducer'
import { Project } from '../types'

export interface SetProjectAction {
  type: ProjectActions.SetProject
  payload: Project
}

// action function to change views
const setProject: ActionFunction<Project> = (state, payload) => ({
  ...state,
  ...payload,
})

export default setProject
