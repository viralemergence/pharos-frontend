import React from 'react'
import styled from 'styled-components'
import DataGrid, { Column } from 'react-data-grid'

import { RecordWithID, RegisterStatus } from 'reducers/projectReducer/types'

import TextEditor from './editors/TextEditor/TextEditor'

import SimpleFormatter from './formatters/SimpleFormatter'

import useVersionedRows from 'hooks/register/useVersionedRows'
import useRegisterStatus from 'hooks/register/useRegisterStatus'

const FillDatasetGrid = styled(DataGrid)`
  block-size: 100%;
  height: calc(100vh - 370px);
`

const DatasetGrid = () => {
  console.time('useVersionedRows')
  const versionedRows = useVersionedRows()
  console.timeEnd('useVersionedRows')

  const registerStatus = useRegisterStatus()

  if (registerStatus === RegisterStatus.Loading) return <></>
  if (registerStatus === RegisterStatus.Error)
    return <p>Error retrieving register</p>
  if (!versionedRows || !versionedRows[0]) return <></>

  const columns: readonly Column<RecordWithID>[] = Object.keys(versionedRows[0])
    .filter(key => key !== '_meta')
    .map(key => ({
      key,
      name: key,
      editor: TextEditor,
      formatter: SimpleFormatter,
      width: 150,
      resizable: true,
    }))

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
