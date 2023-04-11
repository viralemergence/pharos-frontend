import React, { useState } from 'react'
import styled from 'styled-components'
import { FormatterProps } from 'react-data-grid'
import { Datapoint, RecordWithID } from 'reducers/stateReducer/types'

import cellHighlightColors from '../../../../../../config/cellHighlightColors'

import SimpleCellModal from './SimpleCellModal'

const CellContainer = styled.div`
  margin-left: -8px;
  margin-right: -8px;
  padding: 0 8px;
  display: flex;
  justify-content: space-between;

  &:hover > button {
    display: block;
  }
`

const ExpandButton = styled.button`
  display: none;
  background: none;
  border: none;
  margin-top: 6px;
  margin-bottom: 6px;
  border-radius: 3px;

  &:hover {
    background-color: rgba(0, 0, 0, 0.125);
  }
`

const SimpleFormatter = ({
  column,
  row: { [column.key]: datapoint },
}: FormatterProps<RecordWithID>) => {
  const [open, setOpen] = useState(false)

  datapoint = datapoint as Datapoint

  if (!datapoint || !datapoint.dataValue) return <span />

  const backgroundColor = datapoint.report?.status
    ? cellHighlightColors[datapoint.report.status]
    : 'white'

  return (
    <CellContainer style={{ backgroundColor }}>
      <span>{datapoint.dataValue}</span>
      <ExpandButton onClick={() => setOpen(true)}>+</ExpandButton>
      <SimpleCellModal
        {...{ datapointID: column.key, datapoint, open, setOpen }}
      />
    </CellContainer>
  )
}

export default SimpleFormatter
