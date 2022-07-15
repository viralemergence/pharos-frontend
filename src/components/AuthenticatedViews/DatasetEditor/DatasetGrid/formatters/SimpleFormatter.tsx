import useDataset from 'hooks/dataset/useDataset'
import React from 'react'
import { FormatterProps } from 'react-data-grid'
import { Record } from 'reducers/projectReducer/types'

const SimpleFormatter = ({
  column,
  row: { [column.key]: datapoint },
}: FormatterProps<Record>) => {
  const { versions } = useDataset()

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
