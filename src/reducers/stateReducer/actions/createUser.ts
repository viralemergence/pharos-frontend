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
  type: StateActions.CreateLocalUser
  payload: CreateUserActionPayload
}

const createLocalUser: ActionFunction<CreateUserActionPayload> = (
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

  nextState.messageStack = {
    ...state.messageStack,
    [`${APIRoutes.saveUser}_user_local`]: {
      route: APIRoutes.saveUser,
      target: 'local',
      status: StorageMessageStatus.Initial,
      data: user,
    },
  }

  return nextState
}

export default createLocalUser
