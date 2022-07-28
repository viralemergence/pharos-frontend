import React from 'react'
import styled from 'styled-components'

import useProject from 'hooks/project/useProject'
import { GridRow, HeaderRow } from './DatasetsTableRow'
import { ProjectStatus } from 'reducers/projectReducer/types'

const Container = styled.div`
  max-width: 100%;
  overflow-x: scroll;
  margin-top: 20px;
`
const DatasetsGrid = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 800px;
  border: 1px solid ${({ theme }) => theme.veryLightGray};
`

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
    <Container>
      <DatasetsGrid>
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
      </DatasetsGrid>
    </Container>
  )
}

export default DatasetsTable
