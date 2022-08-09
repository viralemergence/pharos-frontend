import React from 'react'

import useProject from 'hooks/project/useProject'
import { GridRow } from './DatasetsTableRow'
import { ProjectStatus } from 'reducers/projectReducer/types'
import ListTable, { HeaderRow } from 'components/ListTable/ListTable'

const DatasetsTable = () => {
  const project = useProject()

  if (
    project.status === ProjectStatus.Initial ||
    project.status === ProjectStatus.Loading
  )
    return <p>Loading project</p>

  const sorted = Object.values(project.datasets)

  Object.values(project.datasets).sort((a, b) => {
    if (!a.versions || !b.versions) return 0
    if (a.versions.length !== 0 || b.versions.length !== 0) return 0
    if (!a.versions.slice(-1)[0]?.date) return 0
    if (!b.versions.slice(-1)[0]?.date) return 0

    return (
      new Date(b.versions.slice(-1)[0].date!).getTime() -
      new Date(a.versions.slice(-1)[0].date!).getTime()
    )
  })

  return (
    <ListTable>
      <HeaderRow>
        <div>Dataset ID</div>
        <div>Name</div>
        <div>Collected Date</div>
        <div>Last Updated</div>
        <div>Samples Taken</div>
        <div>Detection Run</div>
      </HeaderRow>
      {sorted.map(dataset => (
        <GridRow key={dataset.datasetID} dataset={dataset} />
      ))}
    </ListTable>
  )
}

export default DatasetsTable
