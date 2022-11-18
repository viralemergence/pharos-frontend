import { User } from '../types'
import { ActionFunction, StateActions } from '../stateReducer'
import { userInitialValue } from '../initialValues'
import {
  APIRoutes,
  StorageMessageStatus,
} from 'storage/synchronizeMessageQueue'

export interface SetUserAction {
  type: StateActions.SetUser
  payload: User
}

const setUser: ActionFunction<User> = (state, payload) => {
  const nextUser = { ...state.user }
  if (payload.data) {
    nextUser.data = { ...state.user.data, ...payload.data }
    nextUser.data.projectIDs = [
      ...(state.user.data?.projectIDs ?? []),
      ...(payload.data.projectIDs ?? []),
    ]
  }

  return {
    ...state,
    user: nextUser,
    messageStack: {
      ...state.messageStack,
      [`${APIRoutes.saveUser}_user_local`]: {
        route: APIRoutes.saveUser,
        target: 'local',
        status: StorageMessageStatus.Initial,
        data: nextUser,
      },
    },
  }
}

export default setUser
