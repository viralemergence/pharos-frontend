import React from 'react'
import styled from 'styled-components'

import useDatasets from 'hooks/useDatasets'
import { GridRow, HeaderRow } from './DatasetsTableRow'

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

  if (!datasets) return <p>Loading datasets</p>

  const sorted = Object.values(datasets).sort(
    (a, b) =>
      new Date(b.versions.slice(-1)[0].date).getTime() -
      new Date(a.versions.slice(-1)[0].date).getTime()
  )

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
