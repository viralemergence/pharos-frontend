import { ActionFunction, StateActions } from '../stateReducer'
import { AppState, NodeStatus } from '../types'

interface SetAppStateStatusPayload {
  key: 'projects' | 'datasets' | 'register'
  status: NodeStatus
}

export interface SetAppStateStatusAction {
  type: StateActions.SetAppStateStatus
  payload: SetAppStateStatusPayload
}

const setAppStateStatus: ActionFunction<SetAppStateStatusPayload> = (
  state,
  { key, status }
) => {
  return {
    ...state,
    [key]: {
      ...state[key],
      status,
    },
  }
}

export default setAppStateStatus
