import { StateAction } from 'reducers/stateReducer/stateReducer'

import saveUser, { SaveUser } from './storageFunctions/saveUser'
import saveProject, { SaveProject } from 'storage/storageFunctions/saveProject'
import saveDataset, { SaveDataset } from './storageFunctions/saveDataset'
import saveRegister, { SaveRegister } from './storageFunctions/saveRegister'
import deleteDataset, { DeleteDataset } from './storageFunctions/deleteDataset'
import createProject, { CreateProject } from './storageFunctions/createProject'
import saveRecords, { SaveRecords } from './storageFunctions/saveRecords'

export enum StorageMessageStatus {
  // when the api message is created
  Initial = 'Initial',
  // when the request is sent but no
  // response is recieved yet
  Pending = 'Pending',
  // Error states; successful responses are
  // just removed from the queue so it doesn't
  // need to have a success status.
  UserSessionError = 'UserSessionError',
  LocalStorageError = 'LocalStorageError',
  NetworkError = 'NetworkError',
  ServerError = 'ServerError',
  UnknownError = 'UnknownError',
}

export enum APIRoutes {
  saveUser = 'create-user',
  createProject = 'create-project',
  saveProject = 'save-project',
  saveDataset = 'save-dataset',
  deleteDataset = 'delete-dataset',
  saveRegister = 'save-register',
  saveRecords = 'save-records',
}

export interface StorageMessagePayload<Data, Route> {
  data: Route
  route: Data
  target: 'local' | 'remote'
  status: StorageMessageStatus
}

export type StorageMessage =
  | SaveProject
  | CreateProject
  | SaveUser
  | SaveDataset
  | DeleteDataset
  | SaveRegister
  | SaveRecords

export type StorageFunction<T> = (
  key: string,
  data: T,
  dispatch: React.Dispatch<StateAction>
) => void

const synchronizeMessageQueue = async (
  messageStack: { [key: string]: StorageMessage },
  dispatch: React.Dispatch<StateAction>
) => {
  let pendingCount = 0
  for (const [key, message] of Object.entries(messageStack)) {
    // skip messages in these states:
    if (message.status === StorageMessageStatus.Pending) pendingCount++

    if (
      message.status === StorageMessageStatus.LocalStorageError ||
      message.status === StorageMessageStatus.UnknownError ||
      message.status === StorageMessageStatus.ServerError ||
      message.status === StorageMessageStatus.Pending ||
      // skip NetworkError messages if we're offline
      (message.status === StorageMessageStatus.NetworkError && !navigator.onLine)
    ) return

    console.log(
      `${'[MESSAGES]'.padEnd(15)} Synchronize ${message.route} to ${message.target
      }`
    )

    switch (message.route) {
      case APIRoutes.saveUser:
        saveUser(key, message, dispatch)
        continue

      case APIRoutes.saveProject:
        saveProject(key, message, dispatch)
        continue

      case APIRoutes.createProject:
        createProject(key, message, dispatch)
        continue

      case APIRoutes.saveDataset:
        saveDataset(key, message, dispatch)
        continue

      case APIRoutes.deleteDataset:
        deleteDataset(key, message, dispatch)
        continue

      case APIRoutes.saveRegister:
        saveRegister(key, message, dispatch)
        continue

      case APIRoutes.saveRecords:
        saveRecords(key, message, dispatch)
        continue
    }
  }
  console.log(`[MESSAGES] Pending messages: ${pendingCount}`)
}

export default synchronizeMessageQueue
