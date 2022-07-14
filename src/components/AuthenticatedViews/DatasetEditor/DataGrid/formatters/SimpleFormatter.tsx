import React from 'react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SimpleFormatter = ({ column, row }: { row: any; column: any }) => (
  <span
    style={{
      backgroundColor: row[column.key]?.modified ? 'orange' : 'white',
    }}
  >
    {row[column.key]?.displayValue}
  </span>
)

export default SimpleFormatter
