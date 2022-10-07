import { StorageMessage } from 'storage/synchronizeMessageQueue'
import { ActionFunction, ProjectActions } from '../projectReducer'

export interface SetMessageStackAction {
  type: ProjectActions.SetMessageStack
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
