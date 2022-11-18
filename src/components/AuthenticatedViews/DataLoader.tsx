import React from 'react'
import useLoadDatasets from 'hooks/dataLoaders/useLoadDatasets'
import useLoadProjects from 'hooks/dataLoaders/useLoadProjects'
import useLoadRegister from 'hooks/register/useLoadRegister'

const DataLoader = ({ children }: { children: React.ReactNode }) => {
  useLoadProjects()
  useLoadDatasets()
  useLoadRegister()

  return <>{children}</>
}

export default DataLoader
