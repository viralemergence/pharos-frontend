import { useEffect } from 'react'
import localforage from 'localforage'

import { StateAction, StateActions } from 'reducers/stateReducer/stateReducer'
import { User, UserStatus } from 'reducers/stateReducer/types'
import useUserSession from 'hooks/useUserSession'

const useLoadUser = (dispatch: React.Dispatch<StateAction>) => {
  const userSession = useUserSession()

  useEffect(() => {
    const loadUser = async () => {
      if (!userSession) return

      const localUser = (await localforage.getItem('user')) as User | null

      if (localUser) {
        // set local data in state
        dispatch({
          type: StateActions.UpdateUser,
          payload: {
            user: localUser,
            source: 'local',
          },
        })
        dispatch({
          type: StateActions.SetUserStatus,
          payload: { status: UserStatus.LoggedIn },
        })

        // request updated user data
        const response = await fetch(`${process.env.GATSBY_API_URL}/auth`, {
          method: 'POST',
          headers: new Headers({
            Authorization: userSession.getIdToken().getJwtToken(),
            'Content-Type': 'application/json',
          }),
          body: `{"researcherID":"${localUser.researcherID}"}`,
        }).catch(error => console.log(error))

        // if it's valid set the updated data in state
        if (response && response.ok) {
          const remoteUser = (await response.json()) as User
          dispatch({
            type: StateActions.SetUserStatus,
            payload: { status: UserStatus.LoggedIn },
          })
          dispatch({
            type: StateActions.UpdateUser,
            payload: {
              source: 'remote',
              user: remoteUser,
            },
          })
        }
      }

      // if no local user data, set the user
      // to logged out state now that we're sure
      else
        dispatch({
          type: StateActions.SetUserStatus,
          payload: { status: UserStatus.LoggedOut },
        })
    }

    loadUser()
  }, [dispatch, userSession])
}

export default useLoadUser
