import { User } from '../types'
import { ActionFunction, StateActions } from '../stateReducer'
import {
  APIRoutes,
  StorageMessageStatus,
} from 'storage/synchronizeMessageQueue'

interface UpdateUserActionPayload {
  source: 'local' | 'remote'
  user: User
}

export interface UpdateUserAction {
  type: StateActions.UpdateUser
  payload: UpdateUserActionPayload
}

const updateUser: ActionFunction<UpdateUserActionPayload> = (
  state,
  { source, user }
) => {
  console.log({ source, user })
  const nextState = { ...state }
  const nextUser = { ...state.user }
  nextUser.data = { ...state.user.data, ...user }
  nextUser.data.projectIDs = [
    ...new Set([
      ...(state.user.data?.projectIDs ?? []),
      ...(user.projectIDs ?? []),
    ]),
  ]

  nextState.user = nextUser

  // if user data is from remote save to local
  if (source === 'remote')
    nextState.messageStack = {
      ...state.messageStack,
      [`${APIRoutes.saveUser}_user_local`]: {
        route: APIRoutes.saveUser,
        target: 'local',
        status: StorageMessageStatus.Initial,
        data: nextUser.data,
      },
    }

  return nextState
}

export default updateUser
