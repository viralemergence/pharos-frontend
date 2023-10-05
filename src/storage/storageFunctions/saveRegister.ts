import localforage from 'localforage'

import { DatasetID, Register } from 'reducers/stateReducer/types'
import { StateActions } from 'reducers/stateReducer/stateReducer'

import {
  APIRoutes,
  StorageFunction,
  StorageMessagePayload,
  StorageMessageStatus,
} from 'storage/synchronizeMessageQueue'
import { getCognitoSession } from 'components/Authentication/useUserSession'

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
    let userSession
    try {
      userSession = await getCognitoSession()
    } catch (error) {
      dispatch({
        type: StateActions.SetStorageMessageStatus,
        payload: { key, status: StorageMessageStatus.UserSessionError },
      })
      return
    }

    if (!userSession) {
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
            data: remoteRegister.register as Register,
          },
        })
      }
    }
  }
}

export default saveRegister
