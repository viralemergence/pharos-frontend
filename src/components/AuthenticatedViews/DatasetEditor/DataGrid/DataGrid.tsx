import React from 'react'
import styled from 'styled-components'
import { useParams } from 'react-router-dom'

import DataGrid from 'react-data-grid'

import { ProjectStatus } from 'reducers/projectReducer/types'

import useProject from 'hooks/useProject'

const Container = styled.div`
  margin-top: 30px;
`

const FillDatasetGrid = styled(DataGrid)`
  block-size: 100%;
  height: calc(100vh - 370px);
`

const DatasetGrid = () => {
  const { id } = useParams()
  const [project] = useProject()

  if (!id) throw new Error('Missing dataset ID url parameter')
  const dataset = project.datasets[id]

  if (project.status === ProjectStatus.Loading) return <p>Loading dataset</p>

  // const versionStatus = dataset.versions.slice(-1)[0].status

  const rows = dataset.versions?.slice(-1)[0]?.rows
  if (!rows || rows.length === 0) return <></>

  const columns = Object.keys(rows[0]).map(key => ({ key, name: key }))

  return (
    <Container>
      <FillDatasetGrid className={'rdg-light'} columns={columns} rows={rows} />
    </Container>
  )
}

export default DatasetGrid
