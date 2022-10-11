import localforage from 'localforage'

import { Project } from 'reducers/stateReducer/types'
import { StateActions } from 'reducers/stateReducer/stateReducer'

import {
  APIRoutes,
  StorageFunction,
  StorageMessageStatus,
} from 'storage/synchronizeMessageQueue'

export interface SaveProject {
  route: APIRoutes.saveProject
  target: 'local' | 'remote'
  data: Project
  status: StorageMessageStatus
}

const saveProject: StorageFunction<SaveProject> = async (
  key,
  message,
  dispatch
) => {
  dispatch({
    type: StateActions.SetStorageMessageStatus,
    payload: { key, status: StorageMessageStatus.Pending },
  })

  if (message.target === 'local') {
    await localforage.setItem(message.data.projectID, message.data).catch(() =>
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

export default saveProject
