import localforage from 'localforage'

import { Dataset } from 'reducers/stateReducer/types'
import { StateActions } from 'reducers/stateReducer/stateReducer'

import {
  APIRoutes,
  StorageFunction,
  StorageMessagePayload,
  StorageMessageStatus,
} from 'storage/synchronizeMessageQueue'

export type DeleteDataset = StorageMessagePayload<
  APIRoutes.deleteDataset,
  Dataset
>

const deleteDataset: StorageFunction<DeleteDataset> = async (
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
    dispatch({ type: StateActions.RemoveStorageMessage, payload: key })
  } else {
    const response = await fetch(
      `${process.env.GATSBY_API_URL}/${message.route}`,
      {
        method: 'POST',
        body: JSON.stringify({ dataset: message.data, researcherID }),
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
    else dispatch({ type: StateActions.RemoveStorageMessage, payload: key })
  }
}

export default deleteDataset
