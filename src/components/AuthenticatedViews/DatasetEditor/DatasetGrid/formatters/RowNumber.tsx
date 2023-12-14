import React from 'react'
import styled from 'styled-components'
import { FormatterProps } from 'react-data-grid'
import { RecordWithMeta } from 'reducers/stateReducer/types'

const CellContainer = styled.div`
  margin-left: -8px;
  margin-right: -8px;
  padding: 0 8px;
  display: flex;
  justify-content: space-between;
  background-color: ${({ theme }) => theme.veryLightGray};
  display: flex;
  justify-content: center;
  align-items: center;
`

const RowNumber = ({
  row: {
    _meta: { rowNumber },
  },
}: FormatterProps<RecordWithMeta>) => (
  <CellContainer>
    <span>{rowNumber ?? ''}</span>
  </CellContainer>
)

export default RowNumber
