import { User } from '../types'
import { ActionFunction, StateActions } from '../stateReducer'

export interface SetUserAction {
  type: StateActions.SetUser
  payload: User
}

const setUser: ActionFunction<User> = (state, payload) => ({
  ...state,
  user: payload,
})

export default setUser
