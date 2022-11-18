import { ActionFunction, StateActions } from '../stateReducer'
import { NodeStatus } from '../types'

interface SetMetadataObjStatusPayload {
  key: 'projects' | 'datasets' | 'register'
  status: NodeStatus
}

export interface SetMetadataObjStatus {
  type: StateActions.SetMetadataObjStatus
  payload: SetMetadataObjStatusPayload
}

const setMetadataObjStatus: ActionFunction<SetMetadataObjStatusPayload> = (
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

export default setMetadataObjStatus
