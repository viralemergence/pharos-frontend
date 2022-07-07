import React from 'react'
import styled from 'styled-components'
// import DataGrid from 'react-data-grid'

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

  return (
    <Container>
      {/* <DataGrid columns={columns} rows={Object.values(datasets)} /> */}
      <DatasetsGrid>
        <HeaderRow>
          <div>Dataset ID</div>
          <div>Name</div>
          <div>Collected Date</div>
          <div>Last Updated</div>
          <div>Samples Taken</div>
          <div>Detection Run</div>
        </HeaderRow>
        {Object.values(datasets).map(dataset => (
          <GridRow key={dataset.datasetID} dataset={dataset} />
        ))}
      </DatasetsGrid>
    </Container>
  )
}

export default DatasetsTable
