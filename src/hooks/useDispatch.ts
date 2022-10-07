import { useContext } from 'react'
import { ProjectContext } from 'reducers/projectReducer/projectContext'
import { ProjectAction } from 'reducers/projectReducer/projectReducer'

const useDispatch = (): React.Dispatch<ProjectAction> => {
  const context = useContext(ProjectContext)

  // dispatch should be null on the build server; calling
  // this on the build server can lead to rehydration bugs.
  // @ts-expect-error Type 'null' is not assignable to type 'Dispatch<ProjectAction>'
  if (typeof window === 'undefined' && !context) return null

  if (!context?.dispatch) throw new Error('Project context not found')

  return context.dispatch
}

export default useDispatch
