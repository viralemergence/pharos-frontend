import React from 'react'

import { DatasetInfo } from './DatasetsTableRow'
import ListTable, { HeaderRow, RowLink } from 'components/ListTable/ListTable'

import { ProjectStatus } from 'reducers/projectReducer/types'

import useProject from 'hooks/project/useProject'
import useProjectID from 'hooks/project/useProjectID'

const DatasetsTable = () => {
  const projectID = useProjectID()
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
    <ListTable columnTemplate="repeat(4, 1.5fr)">
      <HeaderRow>
        <div>Dataset ID</div>
        <div>Name</div>
        <div>Collected Dates</div>
        <div>Status</div>
      </HeaderRow>
      {sorted.map(dataset => (
        <RowLink
          key={dataset.datasetID}
          to={`/projects/${projectID}/${dataset.datasetID}`}
        >
          <DatasetInfo key={dataset.datasetID} dataset={dataset} />
        </RowLink>
      ))}
    </ListTable>
  )
}

export default DatasetsTable
