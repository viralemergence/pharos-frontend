import { ActionFunction, ProjectActions } from '../projectReducer'
import { ProjectStatus } from '../types'

export interface SetStatusAction {
  type: ProjectActions.SetStatus
  payload: ProjectStatus
}

const setStatus: ActionFunction<ProjectStatus> = (state, payload) => ({
  ...state,
  status: payload,
})

export default setStatus
