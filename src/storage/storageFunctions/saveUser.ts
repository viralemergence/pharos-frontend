import localforage from 'localforage'

import { User } from 'reducers/projectReducer/types'
import { ProjectActions } from 'reducers/projectReducer/projectReducer'

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
    type: ProjectActions.SetStorageMessageStatus,
    payload: { key, status: StorageMessageStatus.Pending },
  })

  if (message.target === 'local') {
    await localforage.setItem('user', message.data).catch(() =>
      dispatch({
        type: ProjectActions.SetStorageMessageStatus,
        payload: { key, status: StorageMessageStatus.LocalStorageError },
      })
    )
    dispatch({ type: ProjectActions.RemoveStorageMessage, payload: key })
  } else {
    dispatch({
      type: ProjectActions.SetStorageMessageStatus,
      payload: { key, status: StorageMessageStatus.NetworkError },
    })
  }
}

export default saveUser
