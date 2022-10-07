import { useContext } from 'react'
import { ProjectContext } from 'reducers/projectReducer/projectContext'

const useDispatch = () => {
  const context = useContext(ProjectContext)

  // dispatch should be null on the build server; calling
  // this on the build server can lead to rehydration bugs.
  if (typeof window === 'undefined' && !context) return null

  if (!context?.dispatch) throw new Error('Project context not found')

  return context.dispatch
}

export default useDispatch
