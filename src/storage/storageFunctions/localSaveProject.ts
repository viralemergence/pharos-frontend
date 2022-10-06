import localforage from 'localforage'

import {
  ProjectAction,
  ProjectActions,
} from 'reducers/projectReducer/projectReducer'
import { Project } from 'reducers/projectReducer/types'

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

const localSaveProject: StorageFunction<SaveProject> = async (
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
  } else console.log('save project to server')
}

export default localSaveProject
