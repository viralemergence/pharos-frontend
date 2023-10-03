import React from 'react'
import styled from 'styled-components'

import defaultColumns from 'config/defaultColumns'
import units, { UnitColumns, Units } from 'config/units'
import { FormatterProps } from 'react-data-grid'
import { Row } from '../PublishedRecordsDataGrid'

const LabelContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  gap: 3px;
`

const Label = styled.span`
  color: ${({ theme }) => theme.darkGray};
`

const Unit = ({
  column,
  row: { [column.key]: value },
}: FormatterProps<Row>) => {
  const columnUnitType =
    defaultColumns[column.key as keyof UnitColumns].unitType

  // 'selecting' the first unit in the object, which is the SI unit
  const selectedUnit = Object.keys(units[columnUnitType])[0]

  const unit = columnUnitType && (units as Units)[columnUnitType][selectedUnit]

  return (
    <LabelContainer>
      <span>{value as string}</span>
      <Label>{unit?.shortLabel}</Label>
    </LabelContainer>
  )
}

export default Unit
