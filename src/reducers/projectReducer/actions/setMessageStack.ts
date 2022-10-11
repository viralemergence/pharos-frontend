import { StorageMessage } from 'storage/synchronizeMessageQueue'
import { ActionFunction, StateActions } from '../projectReducer'

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
