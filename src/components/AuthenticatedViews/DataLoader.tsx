import React from 'react'
import useLoadDatasets from 'hooks/dataLoaders/useLoadDatasets'
import useLoadProjects from 'hooks/dataLoaders/useLoadProjects'

const DataLoader = ({ children }: { children: React.ReactNode }) => {
  useLoadProjects()
  useLoadDatasets()

  return <>{children}</>
}

export default DataLoader
