import { ActionFunction, StateActions } from '../stateReducer'
import { Project } from '../types'

export interface SetProjectAction {
  type: StateActions.SetProject
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
