import localforage from 'localforage'

import {
  APIRoute,
  AppState,
  NodeStatus,
  StorageMessage,
  StorageMessageStatus,
} from 'reducers/projectReducer/types'
import {
  ProjectAction,
  ProjectActions,
} from 'reducers/projectReducer/projectReducer'

import localSaveProject from 'storage/local/localSaveProject'

const synchronizeMessageQueue = async (
  messageStack: { [key: string]: StorageMessage },
  status: NodeStatus,
  dispatch: React.Dispatch<ProjectAction>
) => {
  console.log(`[STATUS]  AppStateStatus: ${status}`)
  console.log(JSON.stringify(messageStack))

  if (Object.keys(messageStack).length > 0) {
    localforage.setItem('messageStack', messageStack)

    for (const [key, message] of Object.entries(messageStack)) {
      switch (message.route) {
        case APIRoute.saveProject:
          if (message.target == 'local')
            localSaveProject(key, message, dispatch)
          else console.log('need to handle server save project')
      }
    }
  }

  localforage.setItem('messageStack', messageStack)
}

export default synchronizeMessageQueue
