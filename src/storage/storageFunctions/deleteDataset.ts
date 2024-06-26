import localforage from 'localforage'

import { Dataset } from 'reducers/stateReducer/types'
import { StateActions } from 'reducers/stateReducer/stateReducer'

import {
  APIRoutes,
  StorageFunction,
  StorageMessagePayload,
  StorageMessageStatus,
} from 'storage/synchronizeMessageQueue'
import { Auth } from 'aws-amplify'
import dispatchRemoveStorageMessage from 'storage/dispatchRemoveStorageMessage'

export type DeleteDataset = StorageMessagePayload<
  APIRoutes.deleteDataset,
  Dataset
>

const deleteDataset: StorageFunction<DeleteDataset> = async (
  key,
  message,
  dispatch
) => {
  dispatch({
    type: StateActions.SetStorageMessageStatus,
    payload: { key, status: StorageMessageStatus.Pending },
  })

  if (message.target === 'local') {
    await localforage.removeItem(message.data.datasetID).catch(() =>
      dispatch({
        type: StateActions.SetStorageMessageStatus,
        payload: { key, status: StorageMessageStatus.LocalStorageError },
      })
    )
    await localforage
      .removeItem(`${message.data.datasetID}-register`)
      .catch(() =>
        dispatch({
          type: StateActions.SetStorageMessageStatus,
          payload: { key, status: StorageMessageStatus.LocalStorageError },
        })
      )
    dispatchRemoveStorageMessage({ key, dispatch })
    // dispatch({ type: StateActions.RemoveStorageMessage, payload: key })
  } else {
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
      response = await fetch(
        `${process.env.GATSBY_API_URL}/${message.route}`,
        {
          method: 'POST',
          headers: new Headers({
            Authorization: userSession.getIdToken().getJwtToken(),
            'Content-Type': 'application/json',
          }),
          body: JSON.stringify({ dataset: message.data }),
        }
      )
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
    else dispatchRemoveStorageMessage({ key, dispatch })
    // dispatch({ type: StateActions.RemoveStorageMessage, payload: key })
  }
}

export default deleteDataset
