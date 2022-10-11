import { User } from '../types'
import { ActionFunction, StateActions } from '../projectReducer'

export interface SetUserAction {
  type: StateActions.SetUser
  payload: User
}

const setUser: ActionFunction<User> = (state, payload) => ({
  ...state,
  user: payload,
})

export default setUser
