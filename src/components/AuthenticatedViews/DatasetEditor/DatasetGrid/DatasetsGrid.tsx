import React from 'react'
import styled from 'styled-components'
import DataGrid, { Column } from 'react-data-grid'

import { RecordWithID } from 'reducers/stateReducer/types'

import TextEditor from './editors/TextEditor/TextEditor'

import SimpleFormatter from './formatters/SimpleFormatter'

import useVersionedRows from 'hooks/register/useVersionedRows'
import generateID from 'utilities/generateID'

import 'react-data-grid/lib/styles.css'
import RowNumber from './formatters/RowNumber'

const FillDatasetGrid = styled(DataGrid)`
  block-size: 100%;
  height: calc(100vh - 300px);
  margin: 0 40px;
`

const DatasetGrid = () => {
  // console.time('useVersionedRows')
  const { rows: versionedRows, colNames } = useVersionedRows()
  // console.timeEnd('useVersionedRows')

  const rowNumberColumn = {
    key: 'rowNumber',
    name: '',
    formatter: RowNumber,
    frozen: true,
    resizable: false,
    minWidth: 35,
    width: 35,
  }

  const columns: readonly Column<RecordWithID>[] = [
    rowNumberColumn,
    ...colNames.map(name => ({
      key: name,
      name,
      editor: TextEditor,
      formatter: SimpleFormatter,
      width: 150,
      resizable: true,
      sortable: true,
    })),
  ]

  versionedRows.push({
    _meta: {
      recordID: generateID.recordID(),
      rowNumber: versionedRows.length + 1,
    },
  })

  return (
    <FillDatasetGrid
      className={'rdg-light'}
      // todo: figure out the typescript for making this
      // work with the data grid library
      columns={columns as Column<unknown>[]}
      rows={versionedRows}
      rowKeyGetter={row => {
        const record = row as unknown as RecordWithID
        return record._meta.recordID
      }}
    />
  )
}

export default DatasetGrid
