import React from 'react'
import styled from 'styled-components'
import { useParams } from 'react-router-dom'

import DataGrid from 'react-data-grid'

import TextEditor from './TextEditor/TextEditor'

import {
  ProjectStatus,
  Record,
  RegisterStatus,
} from 'reducers/projectReducer/types'

import useProject from 'hooks/useProject'
import { ProjectActions } from 'reducers/projectReducer/projectReducer'
import useVersionRows from 'hooks/useVersionRows'
import SimpleFormatter from './formatters/SimpleFormatter'

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

  const versionRows = useVersionRows(id, 0)

  if (project.status !== ProjectStatus.Loaded) return <></>

  if (!id) throw new Error('Missing dataset ID url parameter')

  const dataset = project.datasets[id]
  if (!dataset) return <></>

  if (!Object.keys(dataset.register)) return <p>No active version</p>

  if (dataset.registerStatus === RegisterStatus.Loading)
    return <p>Loading version</p>

  const columns = Object.keys(versionRows).map(key => ({
    key,
    name: key,
    editor: TextEditor,
    formatter: SimpleFormatter,
  }))

  // const handleChange = (rows: Record[]) => {
  //   // check if this version is not saved
  //   // if it's not saved, we just replace the
  //   // current rows with the new rows

  //   // if the edit uses up the last row, create a new row
  //   // check if there are any cells in the last row which are not empty
  //   if (
  //     !Object.values(rows.slice(-1)[0]).every(cell => cell.displayValue == '')
  //   )
  //     // use the keys from the first row to create a new row where all
  //     // cells are empty and add it to the end of a copy of the rows array
  //     rows = [
  //       ...rows,
  //       Object.keys(rows[0]).reduce(
  //         (acc, key) => ({
  //           ...acc,
  //           [key]: { displayValue: '', dataValue: '' },
  //         }),
  //         {}
  //       ),
  //     ]

  //   if (version.status === VersionStatus.Unsaved)
  //     projectDispatch({
  //       type: ProjectActions.UpdateVersion,
  //       payload: { datasetID: id, version: { rows: rows } },
  //     })
  //   // if the project was in saved state, we
  //   // need to create a new version with a
  //   // new timestamp and use these rows
  //   else
  //     projectDispatch({
  //       type: ProjectActions.CreateVersion,
  //       payload: {
  //         datasetID: id,
  //         version: {
  //           date: new Date().toUTCString(),
  //           status: VersionStatus.Unsaved,
  //           rows,
  //         },
  //       },
  //     })
  // }

  return (
    <Container>
      <FillDatasetGrid
        className={'rdg-light'}
        columns={columns}
        rows={versionRows}
        // onRowsChange={rows => handleChange(rows as Record[])}
        // rowKeyGetter={}
      />
    </Container>
  )
}

export default DatasetGrid
