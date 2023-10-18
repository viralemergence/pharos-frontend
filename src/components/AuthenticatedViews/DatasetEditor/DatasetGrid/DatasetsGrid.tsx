import React from 'react'
import styled from 'styled-components'
import DataGrid, { Column } from 'react-data-grid'

import { DatasetReleaseStatus, RecordWithID } from 'reducers/stateReducer/types'

import TextEditor from './editors/TextEditor/TextEditor'

import SimpleFormatter from './formatters/SimpleFormatter'

import useVersionedRows from 'hooks/register/useVersionedRows'
import generateID from 'utilities/generateID'

import defaultColumns from 'config/defaultColumns'

import 'react-data-grid/lib/styles.css'
import RowNumber from './formatters/RowNumber'
import useDataset from 'hooks/dataset/useDataset'
import EditingDisabledEditor from './editors/EditingDisabledEditor'
import { DATASET_LENGTH_LIMIT } from '../DatasetLengthExceededModal/DatasetLengthExceededModal'
import UnitFormatter from './formatters/UnitFormatter'
import UnitEditor from './editors/UnitEditor'

const FillDatasetGrid = styled(DataGrid)`
  block-size: 100%;
  height: calc(100vh - 300px);
  margin: 0 40px;
  ${({ theme }) => theme.gridText}
`

const DatasetGrid = () => {
  const dataset = useDataset()
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
      editor:
        dataset.releaseStatus === DatasetReleaseStatus.Published
          ? EditingDisabledEditor
          : defaultColumns[name as keyof typeof defaultColumns]?.type === 'unit'
          ? UnitEditor
          : TextEditor,
      formatter:
        defaultColumns[name as keyof typeof defaultColumns]?.type === 'unit'
          ? UnitFormatter
          : SimpleFormatter,
      width: name.length * 10 + 15 + 'px',
      resizable: true,
      sortable: true,
    })),
  ]

  // only add new row for editing if
  // the dataset is under the limit
  if (versionedRows.length < DATASET_LENGTH_LIMIT) {
    versionedRows.push({
      _meta: {
        recordID: generateID.recordID(),
        rowNumber: versionedRows.length,
      },
    })
  }
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
