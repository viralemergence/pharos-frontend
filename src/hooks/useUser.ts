import useAppState from './useAppState'
import { userInitialValue } from 'reducers/stateReducer/initialValues'

const useUser = () => {
  const { user } = useAppState()
  // userState will be undefined on the build server
  // so if window is undefined and userState is undefinedj
  // we'll just return the default user state and no state setter
  // since the state should never be updated on the build server anyway.
  // @ts-expect-error: Type 'undefined' is not assignable to type 'UserContext'
  if (typeof window === 'undefined' && !userState) return userInitialValue
  // if we're not on the build server, throw an error since
  // this is a thing that should not happen.
  if (!user) throw new Error('App context not found')

  return user
}

export default useUser
