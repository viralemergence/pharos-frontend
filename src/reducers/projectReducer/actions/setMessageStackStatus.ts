import { ActionFunction, ProjectActions } from '../projectReducer'
import { MessageStackStatus } from '../types'

export interface SetMessageStackStatusAction {
  type: ProjectActions.SetMessageStackStatus
  payload: MessageStackStatus
}

const setMessageStackStatus: ActionFunction<MessageStackStatus> = (
  state,
  payload
) => ({
  ...state,
  messageStackStatus: payload,
})

export default setMessageStackStatus
