import localforage from 'localforage'

import { Dataset } from 'reducers/projectReducer/types'
import { StateActions } from 'reducers/projectReducer/stateReducer'

import {
  APIRoutes,
  StorageFunction,
  StorageMessageStatus,
} from 'storage/synchronizeMessageQueue'

export interface SaveDataset {
  route: APIRoutes.saveDataset
  target: 'local' | 'remote'
  data: Dataset
  status: StorageMessageStatus
}

const saveDataset: StorageFunction<SaveDataset> = async (
  key,
  message,
  dispatch
) => {
  dispatch({
    type: StateActions.SetStorageMessageStatus,
    payload: { key, status: StorageMessageStatus.Pending },
  })

  if (message.target === 'local') {
    await localforage.setItem(message.data.datasetID, message.data).catch(() =>
      dispatch({
        type: StateActions.SetStorageMessageStatus,
        payload: { key, status: StorageMessageStatus.LocalStorageError },
      })
    )
    dispatch({ type: StateActions.RemoveStorageMessage, payload: key })
  } else {
    dispatch({
      type: StateActions.SetStorageMessageStatus,
      payload: { key, status: StorageMessageStatus.NetworkError },
    })
  }
}

export default saveDataset
