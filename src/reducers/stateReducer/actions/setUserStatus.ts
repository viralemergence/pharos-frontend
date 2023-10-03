import { ActionFunction, StateActions } from '../stateReducer'
import { UserStatus } from '../types'

interface UserStatusPayload {
  status: UserStatus
  statusMessage?: string
}

export interface SetUserStatusAction {
  type: StateActions.SetUserStatus
  payload: UserStatusPayload
}

const setUserStatus: ActionFunction<UserStatusPayload> = (state, payload) => {
  return {
    ...state,
    user: {
      ...state.user,
      status: payload.status,
      ...(payload.statusMessage && { statusMessage: payload.statusMessage }),
    },
  }
}

export default setUserStatus
