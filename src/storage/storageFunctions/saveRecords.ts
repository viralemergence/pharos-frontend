import { DatasetID, ProjectID, Register } from 'reducers/stateReducer/types'
import { StateActions } from 'reducers/stateReducer/stateReducer'

import {
  APIRoutes,
  StorageFunction,
  StorageMessagePayload,
  StorageMessageStatus,
} from 'storage/synchronizeMessageQueue'
import { Auth } from 'aws-amplify'

export type SaveRecords = StorageMessagePayload<
  APIRoutes.saveRecords,
  {
    records: Register
    datasetID: DatasetID
    projectID: ProjectID
  }
>

const saveRecords: StorageFunction<SaveRecords> = async (
  key,
  message,
  dispatch
) => {
  dispatch({
    type: StateActions.SetStorageMessageStatus,
    payload: { key, status: StorageMessageStatus.Pending },
  })

  // if (message.target === 'local') {
  //   await localforage
  //     .setItem(`${message.data.datasetID}-records`, message.data.register)
  //     .catch(() =>
  //       dispatch({
  //         type: StateActions.SetStorageMessageStatus,
  //         payload: { key, status: StorageMessageStatus.LocalStorageError },
  //       })
  //     )
  //   dispatch({ type: StateActions.RemoveStorageMessage, payload: key })
  // } else {
  if (message.target === 'local') {
    throw new Error("saveRecords storageFunction cannot be used locally")
  }


  let userSession
  try {
    userSession = await Auth.currentSession()
  } catch (error) {
    dispatch({
      type: StateActions.SetStorageMessageStatus,
      payload: { key, status: StorageMessageStatus.UserSessionError },
    })
    return
  }

  const response = await fetch(
    `${process.env.GATSBY_API_URL}/${message.route}`,
    {
      method: 'POST',
      headers: new Headers({
        Authorization: userSession.getIdToken().getJwtToken(),
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({ ...message.data }),
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

    if (
      remoteRegister &&
      typeof remoteRegister === 'object' &&
      'register' in remoteRegister &&
      typeof remoteRegister?.register === 'object'
    ) {
      dispatch({
        type: StateActions.UpdateRegister,
        payload: {
          source: 'remote',
          datasetID: message.data.datasetID,
          projectID: message.data.projectID,
          data: remoteRegister.register as Register,
        },
      })
    }
  }
}

export default saveRecords
