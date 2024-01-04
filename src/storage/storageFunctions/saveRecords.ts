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

const throttleAsync = (fn: (...args: unknown[]) => Promise<Response>, wait: number) => {
  let lastRun = 0;

  const throttled = async (...args: unknown[]): Promise<Response> => {
    const currentWait = lastRun + wait - Date.now();
    const shouldRun = currentWait <= 0;

    if (shouldRun) {
      lastRun = Date.now();

      return await fn(...args);
    } else {
      return await new Promise(function(resolve) {
        setTimeout(function() {
          resolve(throttled(...args));
        }, currentWait);
      });
    }
  }

  return throttled;
}


const requestSaveRecords = async (userSession: Awaited<ReturnType<typeof Auth.currentSession>>, message: SaveRecords) => {
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
  )

  return response
}

const throttledRequestSaveRecords = throttleAsync(requestSaveRecords, 500)

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

  let response
  try {
    response = await throttledRequestSaveRecords(userSession, message)
  } catch (e) {
    if (!navigator.onLine)
      dispatch({
        type: StateActions.SetStorageMessageStatus,
        payload: { key, status: StorageMessageStatus.NetworkError },
      })
    else
      dispatch({
        type: StateActions.SetStorageMessageStatus,
        payload: { key, status: StorageMessageStatus.UnknownError },
      })
    return
  }


  if (!response.ok)
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
