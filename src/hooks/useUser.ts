import { useContext } from 'react'
import { UserContext } from 'components/Login/UserContextProvider'

const useUser = (): UserContext => {
  const userState = useContext(UserContext)

  // userState will be undefined on the build server
  // so if window is undefined and userState is undefined
  // it's ok to silently return undefined.
  // @ts-expect-error: Type 'undefined' is not assignable to type 'UserContext'
  if (typeof window === 'undefined' && !userState) return undefined
  // if we're not on the build server, throw an error since
  // this is a thing that should not happen.
  if (!userState) throw new Error('User context not found')

  return userState
}

export default useUser
