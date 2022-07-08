import React from 'react'
import styled from 'styled-components'
import { useParams } from 'react-router-dom'

import DataGrid from 'react-data-grid'

import { DatasetsStatus } from 'reducers/datasetsReducer/types'

import useDatasets from 'hooks/useDatasets'

const Container = styled.div`
  margin-top: 30px;
`

const FillDatasetGrid = styled(DataGrid)`
  block-size: 100%;
  height: calc(100vh - 370px);
`

const DatasetGrid = () => {
  const { id } = useParams()
  const [datasets] = useDatasets()

  if (!id) throw new Error('Missing dataset ID url parameter')
  const dataset = datasets.datasets[id]

  if (datasets.status === DatasetsStatus.Loading) return <p>Loading dataset</p>

  // const versionStatus = dataset.versions.slice(-1)[0].status

  const raw = dataset.versions.slice(-1)[0]?.raw
  if (!raw || raw.length === 0) return <></>

  const columns = Object.keys(raw[0]).map(key => ({ key, name: key }))

  return (
    <Container>
      <FillDatasetGrid className={'rdg-light'} columns={columns} rows={raw} />
    </Container>
  )
}

export default DatasetGrid
