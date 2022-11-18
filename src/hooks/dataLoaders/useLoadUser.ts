import { useEffect } from 'react'
import localforage from 'localforage'

import { StateAction, StateActions } from 'reducers/stateReducer/stateReducer'
import { User, UserStatus } from 'reducers/stateReducer/types'

const useLoadUser = (dispatch: React.Dispatch<StateAction>) => {
  useEffect(() => {
    const loadUser = async () => {
      const localUser = (await localforage.getItem('user')) as User | null

      if (localUser) {
        // set local data in state
        dispatch({
          type: StateActions.UpdateUser,
          payload: localUser,
        })

        // request updated user data
        const response = await fetch(`${process.env.GATSBY_API_URL}/auth`, {
          method: 'POST',
          body: `{"researcherID":"${localUser.data?.researcherID}"}`,
        }).catch(error => console.log(error))

        // if it's valid set the updated data in state
        if (response && response.ok) {
          const updatedUserData = await response.json()
          dispatch({
            type: StateActions.UpdateUser,
            payload: {
              status: UserStatus.loggedIn,
              statusMessage: 'Logged in',
              data: updatedUserData,
            },
          })
        }
      }

      // if no local user data, set the user
      // to logged out state now that we're sure
      else
        dispatch({
          type: StateActions.UpdateUser,
          payload: {
            status: UserStatus.loggedOut,
            statusMessage: 'Logged out',
          },
        })
    }

    loadUser()
  }, [dispatch])
}

export default useLoadUser
