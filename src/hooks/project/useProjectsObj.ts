import { useContext } from 'react'
import { ProjectContext } from 'reducers/projectReducer/projectContext'

const useProjecsObj = () => {
  const context = useContext(ProjectContext)

  // some error handling here so we know context is defined
  if (!context) throw new Error('Project context not found')

  return context.projectsObj
}

export default useProjecsObj
