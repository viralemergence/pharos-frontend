import { ActionFunction, StateActions } from '../stateReducer'
import { UserObj } from '../types'

export interface SetUserStatusAction {
  type: StateActions.SetUserStatus
  payload: Exclude<UserObj, 'data'>
}

const setUserStatus: ActionFunction<Exclude<UserObj, 'data'>> = (
  state,
  payload
) => {
  console.log('SET USER STATUS ACTION')
  console.log(payload)
  return {
    ...state,
    user: {
      ...state.user,
      status: payload.status,
      ...(payload.statusMessage && { statusMessage: payload.statusMessage }),
      ...(payload.cognitoResponseType && {
        cognitoResponseType: payload.cognitoResponseType,
      }),
    },
  }
}

export default setUserStatus
