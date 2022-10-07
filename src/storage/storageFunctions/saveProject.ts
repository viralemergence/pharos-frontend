import localforage from 'localforage'

import { Project } from 'reducers/projectReducer/types'
import { ProjectActions } from 'reducers/projectReducer/projectReducer'

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
    type: ProjectActions.SetStorageMessageStatus,
    payload: { key, status: StorageMessageStatus.Pending },
  })

  if (message.target === 'local') {
    await localforage.setItem(message.data.projectID, message.data).catch(() =>
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

export default saveProject
