import React from 'react'
import styled from 'styled-components'
import { useParams } from 'react-router-dom'

import DataGrid, { TextEditor } from 'react-data-grid'

import {
  ProjectStatus,
  Record,
  VersionStatus,
} from 'reducers/projectReducer/types'

import useProject from 'hooks/useProject'
import { ProjectActions } from 'reducers/projectReducer/projectReducer'

const Container = styled.div`
  margin-top: 30px;
`

const FillDatasetGrid = styled(DataGrid)`
  block-size: 100%;
  height: calc(100vh - 370px);
`

const DatasetGrid = () => {
  const { id } = useParams()
  const [project, projectDispatch] = useProject()

  if (project.status !== ProjectStatus.Loaded) return <></>

  if (!id) throw new Error('Missing dataset ID url parameter')
  const dataset = project.datasets[id]
  if (!dataset) return <></>

  const version = dataset.versions?.[dataset.activeVersion]

  if (!version) return <p>No active version</p>

  if (version.status === VersionStatus.Loading) return <p>Loading version</p>

  if (!version.rows || version.rows.length === 0) return <></>

  const columns = Object.keys(version.rows[0]).map(key => ({
    key,
    name: key,
    editor: TextEditor,
  }))

  const handleChange = (rows: Record[]) => {
    // check if this version is not saved
    // if it's not saved, we just replace the
    // current rows with the new rows

    // if the edit uses up the last row, create a new row
    if (!Object.values(rows.slice(-1)[0]).every(cell => cell === '')) {
      const newRow: Record = {}
      for (const key in rows[0]) {
        newRow[key] = ''
      }
      rows.push(newRow)
    }

    if (version.status === VersionStatus.Unsaved)
      projectDispatch({
        type: ProjectActions.UpdateVersion,
        payload: { datasetID: id, version: { rows: rows } },
      })
    // if the project was in saved state, we
    // need to create a new version with a
    // new timestamp and use these rows
    else
      projectDispatch({
        type: ProjectActions.CreateVersion,
        payload: {
          datasetID: id,
          version: {
            date: new Date().toUTCString(),
            status: VersionStatus.Unsaved,
            rows,
          },
        },
      })
  }

  const rowKeyGetter = (row: Record) => Object.values(row)[0] as string

  return (
    <Container>
      <FillDatasetGrid
        className={'rdg-light'}
        columns={columns}
        rows={version.rows}
        rowKeyGetter={row => rowKeyGetter(row as Record)}
        onRowsChange={rows => handleChange(rows as Record[])}
      />
    </Container>
  )
}

export default DatasetGrid
