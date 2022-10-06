import { ActionFunction, ProjectActions } from '../projectReducer'
import { NodeStatus, StorageMessageStatus } from '../types'

export interface SetStorageMessageStatusPayload {
  key: string
  status: StorageMessageStatus
}

export interface SetStorageMessageStatusAction {
  type: ProjectActions.SetStorageMessageStatus
  payload: SetStorageMessageStatusPayload
}

const setStorageMessageStatus: ActionFunction<
  SetStorageMessageStatusPayload
> = (state, { key, status }) => ({
  ...state,
  messageStack: {
    ...state.messageStack,
    [key]: {
      ...state.messageStack[key],
      status,
    },
  },
})

export default setStorageMessageStatus
