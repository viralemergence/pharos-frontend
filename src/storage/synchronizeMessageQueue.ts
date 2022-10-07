import localforage from 'localforage'

import {
  ProjectAction,
  ProjectActions,
} from 'reducers/projectReducer/projectReducer'

import saveProject, { SaveProject } from 'storage/storageFunctions/saveProject'
import saveUser, { SaveUser } from './storageFunctions/saveUser'

export enum StorageMessageStatus {
  // when the api message is created
  Initial = 'Initial',
  // when the request is sent but no
  // response is recieved yet
  Pending = 'Pending',
  // Error states; successful responses are
  // just removed from the queue so it doesn't
  // need to have a success status.
  NetworkError = 'NetworkError',
  ServerError = 'ServerError',
  LocalStorageError = 'LocalStorageError',
  UnknownError = 'UnknownError',
}

export enum APIRoutes {
  saveProject = 'save-project',
  saveUser = 'save-user',
}

export type StorageMessage = SaveProject | SaveUser

export type StorageFunction<T> = (
  key: string,
  data: T,
  dispatch: React.Dispatch<ProjectAction>
) => void

const synchronizeMessageQueue = async (
  messageStack: { [key: string]: StorageMessage },
  dispatch: React.Dispatch<ProjectAction>
) => {
  console.log('[MESSAGES] Synchronize')

  // dispatch({
  //   type: ProjectActions.SetMessageStackStatus,
  //   payload: MessageStackStatus.Syncing,
  // })

  for (const [key, message] of Object.entries(messageStack)) {
    // don't touch messages in these states:
    if (
      message.status !== StorageMessageStatus.LocalStorageError &&
      message.status !== StorageMessageStatus.UnknownError &&
      message.status !== StorageMessageStatus.NetworkError &&
      message.status !== StorageMessageStatus.ServerError &&
      message.status !== StorageMessageStatus.Pending
    ) {
      switch (message.route) {
        case APIRoutes.saveProject:
          saveProject(key, message, dispatch)
          continue

        case APIRoutes.saveUser:
          saveUser(key, message, dispatch)
          continue
      }
    }
  }
}

export default synchronizeMessageQueue
