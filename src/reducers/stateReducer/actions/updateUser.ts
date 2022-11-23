import { User } from '../types'
import { ActionFunction, StateActions } from '../stateReducer'

// import {
//   APIRoutes,
//   StorageMessageStatus,
// } from 'storage/synchronizeMessageQueue'

export interface UpdateUserAction {
  type: StateActions.UpdateUser
  payload: User
}

const updateUser: ActionFunction<User> = (state, payload) => {
  // const nextUser = { ...state.user }
  // if (payload.data) {
  //   nextUser.data = { ...state.user.data, ...payload.data }
  //   nextUser.data.projectIDs = [
  //     ...(state.user.data?.projectIDs ?? []),
  //     ...(payload.data.projectIDs ?? []),
  //   ]
  // }

  return {
    ...state,
    user: payload,
    // messageStack: {
    //   ...state.messageStack,
    //   [`${APIRoutes.saveUser}_user_local`]: {
    //     route: APIRoutes.saveUser,
    //     target: 'local',
    //     status: StorageMessageStatus.Initial,
    //     data: nextUser,
    //   },
    // },
  }
}

export default updateUser
