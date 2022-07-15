import React from 'react'
import styled from 'styled-components'
import DataGrid, { Column } from 'react-data-grid'

import { RegisterStatus } from 'reducers/projectReducer/types'

import TextEditor from './editors/TextEditor'

import SimpleFormatter from './formatters/SimpleFormatter'

import useVersionRows from 'hooks/useVersionRows'
import useRegisterStatus from 'hooks/useRegisterStatus'

const Container = styled.div`
  margin-top: 30px;
`

const FillDatasetGrid = styled(DataGrid)`
  block-size: 100%;
  height: calc(100vh - 370px);
`

const DatasetGrid = () => {
  const versionRows = useVersionRows(0)
  const registerStatus = useRegisterStatus()

  if (registerStatus === RegisterStatus.Loading) return <p>Loading version</p>
  if (!versionRows) return <p>No active version</p>

  const columns = Object.keys(versionRows[0]).map(key => ({
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
        columns={columns as Column<unknown, unknown>[]}
        rows={versionRows}
        // rowKeyGetter={}
      />
    </Container>
  )
}

export default DatasetGrid
