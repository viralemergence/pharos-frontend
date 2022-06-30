import { useContext } from 'react'
import {
  defaultUserState,
  UserContext,
} from 'components/Login/UserContextProvider'

const useUser = (): UserContext => {
  const userState = useContext(UserContext)

  // userState will be undefined on the build server
  // so if window is undefined and userState is undefined
  // we'll just return the default user state and no state setter
  // since the state should never be updated on the build server anyway.
  // @ts-expect-error: Type 'undefined' is not assignable to type 'UserContext'
  if (typeof window === 'undefined' && !userState) return [defaultUserState]
  // if we're not on the build server, throw an error since
  // this is a thing that should not happen.
  if (!userState) throw new Error('User context not found')

  return userState
}

export default useUser
