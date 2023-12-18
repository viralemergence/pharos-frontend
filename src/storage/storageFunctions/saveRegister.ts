import localforage from 'localforage'

import { DatasetID, Register } from 'reducers/stateReducer/types'
import { StateActions } from 'reducers/stateReducer/stateReducer'

import {
  APIRoutes,
  StorageFunction,
  StorageMessagePayload,
  StorageMessageStatus,
} from 'storage/synchronizeMessageQueue'

export type SaveRegister = StorageMessagePayload<
  APIRoutes.saveRegister,
  {
    register: Register
    datasetID: DatasetID
  }
>

const saveRegister: StorageFunction<SaveRegister> = async (
  key,
  message,
  dispatch
) => {
  dispatch({
    type: StateActions.SetStorageMessageStatus,
    payload: { key, status: StorageMessageStatus.Pending },
  })

  if (message.target === 'local') {
    await localforage
      .setItem(`${message.data.datasetID}-register`, message.data.register)
      .catch(() =>
        dispatch({
          type: StateActions.SetStorageMessageStatus,
          payload: { key, status: StorageMessageStatus.LocalStorageError },
        })
      )
    dispatch({ type: StateActions.RemoveStorageMessage, payload: key })
  } else {
    throw new Error("Save Register with target === 'remote' is deprecated")
  }
}

export default saveRegister
