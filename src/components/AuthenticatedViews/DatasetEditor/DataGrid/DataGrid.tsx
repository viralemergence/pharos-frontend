import React from 'react'
import styled from 'styled-components'
import DataGrid from 'react-data-grid'

import { DatasetRow } from 'reducers/datasetsReducer/types'

const Container = styled.div`
  margin-top: 30px;
`

const FillDatasetGrid = styled(DataGrid)`
  block-size: 100%;
  height: calc(100vh - 280px);
`

const DatasetGrid = ({ raw }: { raw: DatasetRow[] | undefined }) => {
  if (!raw || raw.length === 0) return <></>

  const columns = Object.keys(raw[0]).map(key => ({ key, name: key }))

  return (
    <Container>
      <FillDatasetGrid className={'rdg-light'} columns={columns} rows={raw} />
    </Container>
  )
}

export default DatasetGrid
