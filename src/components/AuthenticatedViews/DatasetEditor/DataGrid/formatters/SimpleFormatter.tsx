import React from 'react'
import { FormatterProps } from 'react-data-grid'
import { Record } from 'reducers/projectReducer/types'

const SimpleFormatter = ({ column, row }: FormatterProps<Record, Record>) => (
  <span
    style={{
      backgroundColor: row[column.key].modified ? 'orange' : 'white',
    }}
  >
    {row[column.key].displayValue}
  </span>
)

export default SimpleFormatter
