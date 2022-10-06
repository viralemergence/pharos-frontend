import localforage from 'localforage'

import { ProjectAction } from 'reducers/projectReducer/projectReducer'

import localSaveProject, {
  SaveProject,
} from 'storage/storageFunctions/localSaveProject'

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

export type StorageMessage = SaveProject

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

  localforage.setItem('messageStack', messageStack)

  for (const [key, message] of Object.entries(messageStack)) {
    switch (message.route) {
      case APIRoutes.saveProject:
        localSaveProject(key, message, dispatch)
        continue

      // case APIRoutes.saveUser:
      //   if (message.target === 'local') console.log('Local save user')
      //   else console.log('remote save user')
      //   continue
    }
  }

  localforage.setItem('messageStack', messageStack)
}

export default synchronizeMessageQueue
