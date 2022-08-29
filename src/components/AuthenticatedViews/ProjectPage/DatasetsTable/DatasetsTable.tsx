import React from 'react'

import { DatasetsTableRow } from './DatasetsTableRow'
import ListTable, { HeaderRow, RowLink } from 'components/ListTable/ListTable'

import { ProjectStatus } from 'reducers/projectReducer/types'

import useProject from 'hooks/project/useProject'
import useProjectID from 'hooks/project/useProjectID'

const DatasetsTable = () => {
  const projectID = useProjectID()
  const project = useProject()

  let showLoadingMessage = false

  if (
    project.status === ProjectStatus.Initial ||
    project.status === ProjectStatus.Loading
  )
    showLoadingMessage = true

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
        <div>Name</div>
        <div>Collection Dates</div>
        <div>Status</div>
        <div>Last updated</div>
      </HeaderRow>
      {showLoadingMessage ? (
        <p>Loading datasets...</p>
      ) : (
        sorted.map(dataset => (
          <RowLink
            key={dataset.datasetID}
            to={`/projects/${projectID}/${dataset.datasetID}`}
          >
            <DatasetsTableRow key={dataset.datasetID} dataset={dataset} />
          </RowLink>
        ))
      )}
    </ListTable>
  )
}

export default DatasetsTable
