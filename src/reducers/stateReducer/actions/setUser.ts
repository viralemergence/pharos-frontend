import { User } from '../types'
import { ActionFunction, StateActions } from '../stateReducer'

export interface UpdateUserAction {
  type: StateActions.UpdateUser
  payload: User
}

const setUser: ActionFunction<User> = (state, payload) => ({
  ...state,
  user: payload,
})

export default updateUser
