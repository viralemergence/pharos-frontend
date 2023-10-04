import { User, UserStatus } from '../types'
import { ActionFunction, StateActions } from '../stateReducer'
import {
  APIRoutes,
  StorageMessageStatus,
} from 'storage/synchronizeMessageQueue'
import { CognitoUser } from 'amazon-cognito-identity-js'

interface CreateUserActionPayload {
  user: User
  cognitoUser?: CognitoUser
}

export interface CreateUserAction {
  type: StateActions.CreateUser
  payload: CreateUserActionPayload
}

const createUser: ActionFunction<CreateUserActionPayload> = (
  state,
  { user, cognitoUser }
) => {
  const nextState = {
    ...state,
    user: {
      status: UserStatus.LoggedIn,
      data: user,
      cognitoUser,
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
