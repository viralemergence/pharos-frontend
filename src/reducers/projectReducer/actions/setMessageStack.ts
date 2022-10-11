import { StorageMessage } from 'storage/synchronizeMessageQueue'
import { ActionFunction, StateActions } from '../stateReducer'

export interface SetMessageStackAction {
  type: StateActions.SetMessageStack
  payload: { [key: string]: StorageMessage }
}

const setMessageStack: ActionFunction<{ [key: string]: StorageMessage }> = (
  state,
  payload
) => ({
  ...state,
  messageStack: payload,
})

export default setMessageStack
