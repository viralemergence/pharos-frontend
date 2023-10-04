import { User, UserStatus } from '../types'
import { ActionFunction, StateActions } from '../stateReducer'
import {
  APIRoutes,
  StorageMessageStatus,
} from 'storage/synchronizeMessageQueue'

interface CreateUserActionPayload {
  user: User
}

export interface CreateUserAction {
  type: StateActions.CreateUser
  payload: CreateUserActionPayload
}

const createUser: ActionFunction<CreateUserActionPayload> = (
  state,
  { user }
) => {
  const nextState = {
    ...state,
    user: {
      status: UserStatus.LoggedIn,
      data: user,
    },
  }

  // if user data is from remote save to local
  nextState.messageStack = {
    ...state.messageStack,
    [`${APIRoutes.saveUser}_user_local`]: {
      route: APIRoutes.saveUser,
      target: 'local',
      status: StorageMessageStatus.Initial,
      data: user,
    },
    [`${APIRoutes.saveUser}_user_remote`]: {
      route: APIRoutes.saveUser,
      target: 'remote',
      status: StorageMessageStatus.Initial,
      data: user,
    },
  }

  return nextState
}

export default createUser
