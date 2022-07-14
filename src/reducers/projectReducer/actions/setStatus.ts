import { ActionFunction, ProjectActions } from '../projectReducer'
import { SetProjectStatus } from '../types'

export interface SetStatusAction {
  type: ProjectActions.SetStatus
  payload: SetProjectStatus
}

const setStatus: ActionFunction<SetProjectStatus> = (state, payload) => ({
  ...state,
  status: payload,
})

export default setStatus
