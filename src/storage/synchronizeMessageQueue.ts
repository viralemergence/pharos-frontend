import { StateAction } from 'reducers/stateReducer/stateReducer'

import saveUser, { SaveUser } from './storageFunctions/saveUser'
import saveProject, { SaveProject } from 'storage/storageFunctions/saveProject'
import saveDataset, { SaveDataset } from './storageFunctions/saveDataset'
import saveRegister, { SaveRegister } from './storageFunctions/saveRegister'

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
  saveUser = 'create-user',
  saveProject = 'save-project',
  saveDataset = 'save-dataset',
  saveRegister = 'save-register',
}

export interface StorageMessagePayload<Data, Route> {
  data: Route
  route: Data
  target: 'local' | 'remote'
  status: StorageMessageStatus
}

export type StorageMessage = SaveProject | SaveUser | SaveDataset | SaveRegister

export type StorageFunction<T> = (
  key: string,
  data: T,
  dispatch: React.Dispatch<StateAction>,
  researcherID: string
) => void

const synchronizeMessageQueue = async (
  messageStack: { [key: string]: StorageMessage },
  dispatch: React.Dispatch<StateAction>,
  researcherID: string
) => {
  for (const [key, message] of Object.entries(messageStack)) {
    // skip messages in these states:
    if (
      message.status !== StorageMessageStatus.LocalStorageError &&
      message.status !== StorageMessageStatus.UnknownError &&
      message.status !== StorageMessageStatus.NetworkError &&
      message.status !== StorageMessageStatus.ServerError &&
      message.status !== StorageMessageStatus.Pending
    ) {
      console.log(
        `${'[MESSAGES]'.padEnd(15)} Synchronize ${message.route} to ${
          message.target
        }`
      )

      switch (message.route) {
        case APIRoutes.saveUser:
          saveUser(key, message, dispatch, researcherID)
          continue

        case APIRoutes.saveProject:
          saveProject(key, message, dispatch, researcherID)
          continue

        case APIRoutes.saveDataset:
          saveDataset(key, message, dispatch, researcherID)
          continue

        case APIRoutes.saveRegister:
          saveRegister(key, message, dispatch, researcherID)
          continue
      }
    }
  }
}

export default synchronizeMessageQueue
