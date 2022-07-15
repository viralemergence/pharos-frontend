import useDataset from 'hooks/dataset/useDataset'
import React from 'react'
import { FormatterProps } from 'react-data-grid'
import { Record } from 'reducers/projectReducer/types'

const SimpleFormatter = ({ column, row }: FormatterProps<Record, Record>) => {
  const { versions } = useDataset()
  const datapoint = row[column.key]

  return (
    <span
      style={{
        backgroundColor:
          datapoint.version > versions.length ? 'orange' : 'white',
      }}
    >
      {datapoint.displayValue}
    </span>
  )
}

export default SimpleFormatter
