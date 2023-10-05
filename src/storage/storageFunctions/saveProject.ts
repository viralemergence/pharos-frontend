import localforage from 'localforage'

import { Project } from 'reducers/stateReducer/types'
import { StateActions } from 'reducers/stateReducer/stateReducer'

import {
  APIRoutes,
  StorageFunction,
  StorageMessagePayload,
  StorageMessageStatus,
} from 'storage/synchronizeMessageQueue'
import { getCognitoSession } from 'components/Authentication/useUserSession'

export type SaveProject = StorageMessagePayload<APIRoutes.saveProject, Project>

const saveProject: StorageFunction<SaveProject> = async (
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
    await localforage.setItem(message.data.projectID, message.data).catch(() =>
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
        body: JSON.stringify({ project: message.data, researcherID }),
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

export default saveProject
