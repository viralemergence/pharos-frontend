import localforage from 'localforage'
import pako from 'pako'

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
  dispatch,
  researcherID
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
    const response = await fetch(
      `${process.env.GATSBY_API_URL}/${message.route}`,
      {
        method: 'POST',
        body: JSON.stringify({ ...message.data, researcherID }),
      }
    ).catch(() =>
      dispatch({
        type: StateActions.SetStorageMessageStatus,
        payload: { key, status: StorageMessageStatus.NetworkError },
      })
    )

    if (!response || !response.ok)
      dispatch({
        type: StateActions.SetStorageMessageStatus,
        payload: { key, status: StorageMessageStatus.NetworkError },
      })
    else {
      dispatch({ type: StateActions.RemoveStorageMessage, payload: key })

      const remoteRegister = await response.json()

      console.log(remoteRegister)

      console.log('before decompression')
      const decodedBytes = atob(remoteRegister.register)
      const charData = decodedBytes.split('').map(function (x) {
        return x.charCodeAt(0)
      })
      console.log(charData)
      const binData = new Uint8Array(charData)
      const decompressedString = pako.inflate(binData, { to: 'string' })
      // console.log(decompressedData)
      // const decompressedString = String.fromCharCode.apply(
      //   null,
      //   new Uint16Array(decompressedData)
      // )

      const nextRegister = JSON.parse(decompressedString)

      console.log(nextRegister.register)

      // if (
      //   remoteRegister &&
      //   typeof remoteRegister === 'object' &&
      //   'register' in remoteRegister &&
      //   typeof remoteRegister?.register === 'object'
      // ) {
      dispatch({
        type: StateActions.UpdateRegister,
        payload: {
          source: 'remote',
          datasetID: message.data.datasetID,
          data: nextRegister.register as Register,
        },
      })
      // }
    }
  }
}

export default saveRegister
