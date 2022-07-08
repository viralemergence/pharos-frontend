import React from 'react'
import styled from 'styled-components'
import { useParams } from 'react-router-dom'

import DataGrid from 'react-data-grid'

import { ProjectStatus, VersionStatus } from 'reducers/projectReducer/types'

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

  if (project.status !== ProjectStatus.Loaded) return <></>

  if (!id) throw new Error('Missing dataset ID url parameter')
  const dataset = project.datasets[id]
  if (!dataset) return <></>

  const version = dataset.versions?.[dataset.activeVersion]

  if (!version) return <p>No active version</p>

  if (version.status === VersionStatus.Loading) return <p>Loading version</p>

  if (!version.rows || version.rows.length === 0) return <></>

  const columns = Object.keys(version.rows[0]).map(key => ({ key, name: key }))

  return (
    <Container>
      <FillDatasetGrid
        className={'rdg-light'}
        columns={columns}
        rows={version.rows}
      />
    </Container>
  )
}

export default DatasetGrid
