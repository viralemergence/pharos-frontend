import { useContext, useEffect } from 'react'
import {
  defaultUserState,
  User,
  UserContext,
  UserStatus,
} from 'components/Login/UserContextProvider'
import useAppState from './useAppState'
import localforage from 'localforage'
import useDispatch from './useDispatch'
import { ProjectActions } from 'reducers/projectReducer/projectReducer'

// const useUser = (): UserContext['user'] => {
//   const userState = useContext(UserContext)

//   // userState will be undefined on the build server
//   // so if window is undefined and userState is undefined
//   // we'll just return the default user state and no state setter
//   // since the state should never be updated on the build server anyway.
//   // @ts-expect-error: Type 'undefined' is not assignable to type 'UserContext'
//   if (typeof window === 'undefined' && !userState) return [defaultUserState]
//   // if we're not on the build server, throw an error since
//   // this is a thing that should not happen.
//   if (!userState) throw new Error('User context not found')

//   // return the user portion of the state
//   return userState.user
// }

// export default useUser

// export const useSetUser = (): UserContext['setUser'] => {
//   const userState = useContext(UserContext)

//   // setUserState should be null on the build server; calling
//   // this on the build server can lead to rehydration bugs.
//   // @ts-expect-error: Type 'undefined' is not assignable to type 'UserContext'
//   if (typeof window === 'undefined' && !userState) return null

//   if (!userState) throw new Error('User context not found')
//   return userState.setUser
// }

const useUser = () => {
  const { user } = useAppState()
  const dispatch = useDispatch()

  // async check for local user data
  useEffect(() => {
    const loadUser = async () => {
      const localUser = (await localforage.getItem('user')) as User | null

      if (localUser) {
        // set local data in state
        dispatch({
          type: ProjectActions.SetUser,
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
            type: ProjectActions.SetUser,
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
          type: ProjectActions.SetUser,
          payload: {
            status: UserStatus.loggedOut,
            statusMessage: 'Logged out',
          },
        })
    }

    loadUser()
  }, [dispatch])
  // // userState will be undefined on the build server
  // // so if window is undefined and userState is undefined
  // // we'll just return the default user state and no state setter
  // // since the state should never be updated on the build server anyway.
  // // @ts-expect-error: Type 'undefined' is not assignable to type 'UserContext'
  // if (typeof window === 'undefined' && !userState) return [defaultUserState]
  // // if we're not on the build server, throw an error since
  // // this is a thing that should not happen.
  // if (!user) throw new Error('App context not found')

  return user
}

export default useUser
