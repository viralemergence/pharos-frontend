import localforage from 'localforage'

import { Project } from 'reducers/stateReducer/types'
import { StateActions } from 'reducers/stateReducer/stateReducer'

import {
  APIRoutes,
  StorageFunction,
  StorageMessagePayload,
  StorageMessageStatus,
} from 'storage/synchronizeMessageQueue'
import { Auth } from 'aws-amplify'

export type CreateProject = StorageMessagePayload<
  APIRoutes.createProject,
  Project
>

const createProject: StorageFunction<CreateProject> = async (
  key,
  message,
  dispatch
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
          body: JSON.stringify({ project: message.data }),
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
    else dispatch({ type: StateActions.RemoveStorageMessage, payload: key })
  }
}

export default createProject
