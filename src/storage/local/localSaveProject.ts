import localforage from 'localforage'

import {
  ProjectAction,
  ProjectActions,
} from 'reducers/projectReducer/projectReducer'

import {
  StorageMessage,
  StorageMessageStatus,
} from 'reducers/projectReducer/types'

const localSaveProject = async (
  key: string,
  message: StorageMessage,
  dispatch: React.Dispatch<ProjectAction>
) => {
  dispatch({
    type: ProjectActions.SetStorageMessageStatus,
    payload: { key, status: StorageMessageStatus.Pending },
  })

  localforage.setItem(message.data.projectID, message.data).catch(() =>
    dispatch({
      type: ProjectActions.SetStorageMessageStatus,
      payload: { key, status: StorageMessageStatus.LocalStorageError },
    })
  )

  dispatch({ type: ProjectActions.RemoveStorageMessage, payload: key })
}

export default localSaveProject
