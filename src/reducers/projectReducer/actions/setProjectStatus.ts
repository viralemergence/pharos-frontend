import { ActionFunction, ProjectActions } from '../projectReducer'
import { ProjectStatus } from '../types'

export interface SetProjectStatusAction {
  type: ProjectActions.SetProjectStatus
  payload: ProjectStatus
}

const setProjectStatus: ActionFunction<ProjectStatus> = (state, payload) => ({
  ...state,
  status: payload,
})

export default setProjectStatus
