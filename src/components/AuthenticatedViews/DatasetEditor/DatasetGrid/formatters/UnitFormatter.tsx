import React, { useState } from 'react'
import { FormatterProps } from 'react-data-grid'
import { Datapoint, RecordWithID } from 'reducers/stateReducer/types'

import cellHighlightColors from '../../../../../../config/cellHighlightColors'

import SimpleCellModal from './SimpleCellModal'
import { CellContainer, ExpandButton } from '../DisplayComponents'

import units, { Units } from '../../../../../config/units'
import columns from 'config/defaultColumns'
import useDataset from 'hooks/dataset/useDataset'

type UnitColumns = {
  Age: (typeof columns)['Age']
  Mass: (typeof columns)['Mass']
  Length: (typeof columns)['Length']
}

const UnitFormatter = ({
  column,
  row: { [column.key]: datapoint },
}: FormatterProps<RecordWithID>) => {
  const dataset = useDataset()
  const [open, setOpen] = useState(false)

  datapoint = datapoint as Datapoint

  if (!datapoint || !datapoint.dataValue) return <span />

  const backgroundColor = datapoint.report?.status
    ? cellHighlightColors[datapoint.report.status]
    : 'rgba(0,0,0,0)'

  const columnUnitType = columns[column.key as keyof UnitColumns].unitType

  const selectedUnit =
    dataset[columnUnitType] ??
    (Object.keys(
      units[columnUnitType]
    )[0] as keyof (typeof units)[typeof columnUnitType])

  // casting units to the Units type because I don't know how to make
  // typescript compute the right units per unit type instead of outputting
  // the full union of all possible units from all types
  const unit = columnUnitType && (units as Units)[columnUnitType][selectedUnit]

  return (
    <CellContainer style={{ backgroundColor }}>
      <span>
        {unit.fromSIUnits(Number(datapoint.dataValue)).toPrecision(4)}{' '}
        {unit.shortLabel}
      </span>
      <ExpandButton onClick={() => setOpen(true)}>+</ExpandButton>
      <SimpleCellModal
        {...{ datapointID: column.key, datapoint, open, setOpen }}
      />
    </CellContainer>
  )
}

export default UnitFormatter