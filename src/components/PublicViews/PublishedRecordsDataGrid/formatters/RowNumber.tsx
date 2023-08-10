import React from 'react'
import styled from 'styled-components'

import { FormatterProps } from 'react-data-grid'

import { CellContainer } from './DisplayComponents'

import { Row } from '../PublishedRecordsDataGrid'

const RowNumberContainer = styled(CellContainer)`
  background-color: ${({ theme }) => theme.mutedPurple3};
  display: flex;
  justify-content: center;
  align-items: center;
`

const RowNumber = ({ row: { rowNumber } }: FormatterProps<Row>) => (
  <RowNumberContainer>
    <span>{Number(rowNumber)}</span>
  </RowNumberContainer>
)

export default RowNumber
