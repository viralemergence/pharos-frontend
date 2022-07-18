import React from 'react'
import styled from 'styled-components'
import DataGrid, { Column } from 'react-data-grid'

import { RecordWithID, RegisterStatus } from 'reducers/projectReducer/types'

import TextEditor from './editors/TextEditor'

import SimpleFormatter from './formatters/SimpleFormatter'

import useVersionedRows from 'hooks/register/useVersionedRows'
import useRegisterStatus from 'hooks/register/useRegisterStatus'

const Container = styled.div`
  margin-top: 30px;
`

const FillDatasetGrid = styled(DataGrid)`
  block-size: 100%;
  height: calc(100vh - 370px);
`

const DatasetGrid = () => {
  const versionedRows = useVersionedRows()
  const registerStatus = useRegisterStatus()

  if (registerStatus === RegisterStatus.Loading) return <p>Loading version</p>
  if (!versionedRows || !versionedRows[0]) return <p>No active version</p>

  const columns: readonly Column<RecordWithID>[] = Object.keys(versionedRows[0])
    .filter(key => key !== '_meta')
    .map(key => ({
      key,
      name: key,
      editor: TextEditor,
      formatter: SimpleFormatter,
    }))

  return (
    <Container>
      <FillDatasetGrid
        className={'rdg-light'}
        // todo: figure out the typescript for making this
        // work with the data grid library
        columns={columns as Column<unknown>[]}
        rows={versionedRows}
        rowKeyGetter={row => {
          const record = row as unknown as RecordWithID
          console.log(record._meta.recordID)
          return record._meta.recordID
        }}
      />
    </Container>
  )
}

export default DatasetGrid
