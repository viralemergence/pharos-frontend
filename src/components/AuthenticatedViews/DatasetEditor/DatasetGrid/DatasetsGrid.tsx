import React from 'react'
import styled from 'styled-components'
import DataGrid, { Column } from 'react-data-grid'

import {
  DatasetReleaseStatus,
  RecordWithMeta,
} from 'reducers/stateReducer/types'

import TextEditor from './editors/TextEditor/TextEditor'

import SimpleFormatter from './formatters/SimpleFormatter'

import useVersionedRows from 'hooks/register/useVersionedRows'
import generateID from 'utilities/generateID'

import defaultColumns from 'config/defaultColumns'

import 'react-data-grid/lib/styles.css'
import RowNumber from './formatters/RowNumber'
import useDataset from 'hooks/dataset/useDataset'
import EditingDisabledEditor from './editors/EditingDisabledEditor'
import UnitFormatter from './formatters/UnitFormatter'
import UnitEditor from './editors/UnitEditor'
import { DATASET_LENGTH_LIMIT } from '../DatasetLengthExceededModal/DatasetLengthExceededModal'

// Intended size:
export const DATASET_PAGINATION_SIZE = 500

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

  const columns: readonly Column<RecordWithMeta>[] = [
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

  // only add rows for editing if
  // the dataset is under the length limit
  if (versionedRows.length < DATASET_LENGTH_LIMIT) {
    versionedRows.push({
      _meta: {
        recordID: generateID.recordID(
          Math.ceil((versionedRows.length + 1) / DATASET_PAGINATION_SIZE)
        ),
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
        const record = row as unknown as RecordWithMeta
        return record._meta.recordID
      }}
    />
  )
}

export default DatasetGrid
