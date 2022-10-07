import { ProjectAction } from 'reducers/projectReducer/projectReducer'

import saveUser, { SaveUser } from './storageFunctions/saveUser'
import saveProject, { SaveProject } from 'storage/storageFunctions/saveProject'
import saveDataset, { SaveDataset } from './storageFunctions/saveDataset'

export enum StorageMessageStatus {
  // when the api message is created
  Initial = 'Initial',
  // when the request is sent but no
  // response is recieved yet
  Pending = 'Pending',
  // Error states; successful responses are
  // just removed from the queue so it doesn't
  // need to have a success status.
  LocalStorageError = 'LocalStorageError',
  NetworkError = 'NetworkError',
  ServerError = 'ServerError',
  UnknownError = 'UnknownError',
}

export enum APIRoutes {
  saveUser = 'save-user',
  saveProject = 'save-project',
  saveDataset = 'save-dataset',
}

export type StorageMessage = SaveProject | SaveUser | SaveDataset

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
    // skip messages in these states:
    if (
      message.status !== StorageMessageStatus.LocalStorageError &&
      message.status !== StorageMessageStatus.UnknownError &&
      message.status !== StorageMessageStatus.NetworkError &&
      message.status !== StorageMessageStatus.ServerError &&
      message.status !== StorageMessageStatus.Pending
    ) {
      switch (message.route) {
        case APIRoutes.saveUser:
          saveUser(key, message, dispatch)
          continue

        case APIRoutes.saveProject:
          saveProject(key, message, dispatch)
          continue

        case APIRoutes.saveDataset:
          saveDataset(key, message, dispatch)
          continue
      }
    }
  }
}

export default synchronizeMessageQueue
