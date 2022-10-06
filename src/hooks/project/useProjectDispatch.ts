import { useContext } from 'react'
import { ProjectContext } from 'reducers/projectReducer/projectContext'

const useDispatch = () => {
  const context = useContext(ProjectContext)

  // some error handling here so we know context is defined
  if (!context) throw new Error('Project context not found')

  return context.dispatch
}

export default useDispatch
