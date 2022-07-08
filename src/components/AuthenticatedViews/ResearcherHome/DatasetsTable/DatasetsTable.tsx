import React from 'react'
import styled from 'styled-components'

import useDatasets from 'hooks/useDatasets'
import { GridRow, HeaderRow } from './DatasetsTableRow'
import { DatasetsStatus } from 'reducers/datasetsReducer/types'

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
  const [datasets] = useDatasets()

  if (
    datasets.status === DatasetsStatus.Initial ||
    datasets.status === DatasetsStatus.Loading
  )
    return <p>Loading datasets</p>

  const sorted = Object.values(datasets.datasets)

  // Object.values(datasets.datasets).sort((a, b) =>
  //   a.versions.length !== 0 || b.versions.length !== 0
  //     ? new Date(b.versions.slice(-1)[0].date).getTime() -
  //       new Date(a.versions.slice(-1)[0].date).getTime()
  //     : -1
  // )

  console.log(datasets)

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
