import localforage from 'localforage'

import { User } from 'reducers/projectReducer/types'
import { StateActions } from 'reducers/projectReducer/stateReducer'

import {
  APIRoutes,
  StorageFunction,
  StorageMessageStatus,
} from 'storage/synchronizeMessageQueue'

export interface SaveUser {
  route: APIRoutes.saveUser
  target: 'local' | 'remote'
  data: User
  status: StorageMessageStatus
}

const saveUser: StorageFunction<SaveUser> = async (key, message, dispatch) => {
  dispatch({
    type: StateActions.SetStorageMessageStatus,
    payload: { key, status: StorageMessageStatus.Pending },
  })

  if (message.target === 'local') {
    await localforage.setItem('user', message.data).catch(() =>
      dispatch({
        type: StateActions.SetStorageMessageStatus,
        payload: { key, status: StorageMessageStatus.LocalStorageError },
      })
    )
    dispatch({ type: StateActions.RemoveStorageMessage, payload: key })
  } else {
    dispatch({
      type: StateActions.SetStorageMessageStatus,
      payload: { key, status: StorageMessageStatus.NetworkError },
    })
  }
}

export default saveUser
