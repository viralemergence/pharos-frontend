import { ActionFunction, ProjectActions } from '../projectReducer'
import { NodeStatus, StorageMessageStatus } from '../types'

export interface RemoveStorageMessageAction {
  type: ProjectActions.RemoveStorageMessage
  payload: string
}

const removeStorageMessage: ActionFunction<string> = (state, key) => {
  const { [key]: _, ...nextMessageStack } = state.messageStack

  return {
    ...state,
    messageStack: {
      ...nextMessageStack,
    },
  }
}

export default removeStorageMessage
