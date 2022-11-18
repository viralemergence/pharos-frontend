import { ActionFunction, StateActions } from '../stateReducer'

export interface RemoveStorageMessageAction {
  type: StateActions.RemoveStorageMessage
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
