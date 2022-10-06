import { useContext } from 'react'
import { ProjectContext } from 'reducers/projectReducer/projectContext'
import { stateInitialValue } from 'reducers/projectReducer/projectReducer'

const useAppState = () => {
  const context = useContext(ProjectContext)

  // userState will be undefined on the build server
  // so if window is undefined and userState is undefined
  // we'll just return the default user state and no state setter
  // since the state should never be updated on the build server anyway.
  if (typeof window === 'undefined' && !context) return stateInitialValue

  // if we're not on the build server, throw an error since
  // this is a thing that should not happen.
  if (!context) throw new Error('Project context not found')

  return context.state
}

export default useAppState
