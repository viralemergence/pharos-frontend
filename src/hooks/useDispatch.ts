import { useContext } from 'react'
import { StateContext } from 'reducers/stateReducer/stateContext'
import { StateAction } from 'reducers/stateReducer/stateReducer'

const useDispatch = (): React.Dispatch<StateAction> => {
  const context = useContext(StateContext)

  // dispatch should be null on the build server; calling
  // this on the build server can lead to rehydration bugs.
  // @ts-expect-error Type 'null' is not assignable to type 'Dispatch<ProjectAction>'
  if (typeof window === 'undefined' && !context) return null

  if (!context?.dispatch) throw new Error('Project context not found')

  return context.dispatch
}

export default useDispatch
