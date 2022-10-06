import localforage from 'localforage'

import {
  ProjectAction,
  ProjectActions,
} from 'reducers/projectReducer/projectReducer'
import { MessageStackStatus } from 'reducers/projectReducer/types'

import saveProject, { SaveProject } from 'storage/storageFunctions/saveProject'
import saveUser, { SaveUser } from './storageFunctions/saveUser'

export enum StorageMessageStatus {
  // when the api message is created
  Initial,
  // when the request is sent but no
  // response is recieved yet
  Pending,
  // Error states; successful responses are
  // just removed from the queue so it doesn't
  // need to have a success status.
  NetworkError,
  ServerError,
  LocalStorageError,
  UnknownError,
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
  console.log(JSON.stringify(messageStack))
  console.count('synchronizeMessageQueue')

  dispatch({
    type: ProjectActions.SetMessageStackStatus,
    payload: MessageStackStatus.Syncing,
  })

  localforage.setItem('messageStack', messageStack)

  for (const [key, message] of Object.entries(messageStack)) {
    switch (message.route) {
      case APIRoutes.saveProject:
        saveProject(key, message, dispatch)
        continue

      case APIRoutes.saveUser:
        saveUser(key, message, dispatch)
        continue
    }
  }

  localforage.setItem('messageStack', messageStack)
}

export default synchronizeMessageQueue
