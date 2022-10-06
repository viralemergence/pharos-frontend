import { User } from 'components/Login/UserContextProvider'
import { ActionFunction, ProjectActions } from '../projectReducer'

export interface SetUserAction {
  type: ProjectActions.SetUser
  payload: User
}

const setUser: ActionFunction<User> = (state, payload) => ({
  ...state,
  user: payload,
})

export default setUser
