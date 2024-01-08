import { DatasetID, ProjectID, Register } from 'reducers/stateReducer/types'
import { StateActions } from 'reducers/stateReducer/stateReducer'

import {
  APIRoutes,
  StorageFunction,
  StorageMessagePayload,
  StorageMessageStatus,
} from 'storage/synchronizeMessageQueue'
import { Auth } from 'aws-amplify'
import dispatchRemoveStorageMessage from 'storage/dispatchRemoveStorageMessage'
// import localforage from 'localforage'

export type SaveRecords = StorageMessagePayload<
  APIRoutes.saveRecords,
  {
    records: Register
    datasetID: DatasetID
    projectID: ProjectID
  }
>

const throttleAsync = (fn: (...args: unknown[]) => Promise<Response>, wait: number, concurrency: number) => {
  let lastRun = 0;
  let active = 0;

  const throttled = async (...args: unknown[]): Promise<Response> => {
    const currentWait = lastRun + wait - Date.now();
    const shouldRun = currentWait <= 0 && active < concurrency;

    if (shouldRun) {
      lastRun = Date.now();
      active++
      const result = await fn(...args);
      active--
      return result
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

// @ts-expect-error
const throttledRequestSaveRecords = throttleAsync(requestSaveRecords, 250, 5)

const saveRecords: StorageFunction<SaveRecords> = async (
  key,
  message,
  dispatch
) => {
  dispatch({
    type: StateActions.SetStorageMessageStatus,
    payload: { key, status: StorageMessageStatus.Pending },
  })

  //   if (message.target === 'local') {
  //     const firstRecordID = Object.keys(message.data.records)[0]
  //     const idParts = firstRecordID.split('|')
  //     let page: number | null = null
  //     if (idParts.length === 2) {
  //       page = Number(idParts[0].replace('rec', ''))
  //     }

  //     await localforage
  //       .setItem(`${message.data.datasetID}-${page}-records`, message.data)
  //       .catch(() =>
  //         dispatch({
  //           type: StateActions.SetStorageMessageStatus,
  //           payload: { key, status: StorageMessageStatus.LocalStorageError },
  //         })
  //       )
  //     dispatch({ type: StateActions.RemoveStorageMessage, payload: key })
  //     return
  //   }
  // else {
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

    const remoteRegister = await response.json()

    if (
      remoteRegister &&
      typeof remoteRegister === 'object' &&
      'register' in remoteRegister &&
      typeof remoteRegister?.register === 'object'
    ) {

      const windowDatasetID = window.location.hash.split('/').slice(-1)[0]

      if (remoteRegister.register && Object.keys(remoteRegister.register).length > 0
        && windowDatasetID === message.data.datasetID
      )
        dispatch({
          type: StateActions.UpdateRegister,
          payload: {
            source: 'remote',
            datasetID: message.data.datasetID,
            projectID: message.data.projectID,
            data: remoteRegister.register as Register,
          },
        })

      dispatchRemoveStorageMessage({ key, dispatch })
      // dispatch({ type: StateActions.RemoveStorageMessage, payload: key })
    }
  }
}

export default saveRecords
