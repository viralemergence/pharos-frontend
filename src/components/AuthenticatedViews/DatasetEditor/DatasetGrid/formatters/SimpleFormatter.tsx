import React, { useState } from 'react'
import { FormatterProps } from 'react-data-grid'
import { Datapoint, RecordWithMeta } from 'reducers/stateReducer/types'

import cellHighlightColors from '../../../../../../config/cellHighlightColors'

import SimpleCellModal from './SimpleCellModal'
import { CellContainer, ExpandButton } from '../DisplayComponents'

const SimpleFormatter = ({
  column,
  row: { [column.key]: datapoint },
}: FormatterProps<RecordWithMeta>) => {
  const [open, setOpen] = useState(false)

  datapoint = datapoint as Datapoint

  if (!datapoint || !datapoint.dataValue) return <span />

  const backgroundColor = datapoint?.report?.status
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
