import localforage from 'localforage'

import { User } from 'reducers/stateReducer/types'
import { StateActions } from 'reducers/stateReducer/stateReducer'

import {
  APIRoutes,
  StorageFunction,
  StorageMessagePayload,
  StorageMessageStatus,
} from 'storage/synchronizeMessageQueue'

import { Auth } from 'aws-amplify'
import dispatchRemoveStorageMessage from 'storage/dispatchRemoveStorageMessage'

export type SaveUser = StorageMessagePayload<APIRoutes.saveUser, User>

const saveUser: StorageFunction<SaveUser> = async (key, message, dispatch) => {
  dispatch({
    type: StateActions.SetStorageMessageStatus,
    payload: { key, status: StorageMessageStatus.Pending },
  })

  if (message.target === 'local') {
    await localforage.setItem('user', message.data).catch(() =>
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

    const { researcherID: _, ...saveUserData } = message.data

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
          body: JSON.stringify(saveUserData),
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

export default saveUser
