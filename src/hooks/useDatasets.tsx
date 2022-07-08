import { useContext } from 'react'
import { DatasetsContext } from 'reducers/datasetsReducer/datasetsContext'

const useDatasets = () => {
  const context = useContext(DatasetsContext)

  // some error handling here so we know context is defined
  if (!context) throw new Error('Datasets context not found')

  return context
}

export default useDatasets
