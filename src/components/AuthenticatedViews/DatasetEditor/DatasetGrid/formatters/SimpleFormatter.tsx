import React, { useState } from 'react'
import useDataset from 'hooks/dataset/useDataset'
import styled from 'styled-components'
import { FormatterProps } from 'react-data-grid'
import { Datapoint, RecordWithID } from 'reducers/projectReducer/types'

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
  const { versions } = useDataset()
  const [open, setOpen] = useState(false)

  datapoint = datapoint as Datapoint

  if (!datapoint || !datapoint.displayValue) return <span />

  let backgroundColor: string
  switch (true) {
    case Number(datapoint.version) >= versions.length:
      backgroundColor = '#ffc6a3'
      break
    default:
      backgroundColor = 'rgba(0,0,0,0)'
  }

  return (
    <CellContainer style={{ backgroundColor }}>
      <span>{datapoint.displayValue}</span>
      <ExpandButton onClick={() => setOpen(true)}>+</ExpandButton>
      <SimpleCellModal
        {...{ datapointID: column.key, datapoint, open, setOpen }}
      />
    </CellContainer>
  )
}

export default SimpleFormatter
