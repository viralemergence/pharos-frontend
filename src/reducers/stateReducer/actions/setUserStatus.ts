import { ActionFunction, StateActions } from '../stateReducer'
import { UserStatus } from '../types'

export interface SetUserStatusAction {
  type: StateActions.SetUserStatus
  payload: UserStatus
}

const setUserStatus: ActionFunction<UserStatus> = (state, payload) => {
  return {
    ...state,
    user: {
      ...state.user,
      status: payload,
    },
  }
}

export default setUserStatus
