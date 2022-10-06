import { ActionFunction, ProjectActions } from '../projectReducer'
import { NodeStatus } from '../types'

export interface SetAppStateStatusAction {
  type: ProjectActions.SetAppStateStatus
  payload: NodeStatus
}

const setAppStateStatus: ActionFunction<NodeStatus> = (state, payload) => {
  return {
    ...state,
    status: payload,
  }
}

export default setAppStateStatus
