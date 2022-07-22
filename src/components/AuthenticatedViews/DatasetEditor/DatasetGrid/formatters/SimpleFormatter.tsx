import useDataset from 'hooks/dataset/useDataset'
import React from 'react'
import { FormatterProps } from 'react-data-grid'
import { Datapoint, RecordWithID } from 'reducers/projectReducer/types'

const SimpleFormatter = ({
  column,
  row: { [column.key]: datapoint },
}: FormatterProps<RecordWithID>) => {
  const { versions } = useDataset()

  datapoint = datapoint as Datapoint

  return (
    <span
      style={{
        backgroundColor:
          Number(datapoint.version) > versions.length ? 'orange' : 'white',
      }}
    >
      {datapoint.displayValue}
    </span>
  )
}

export default SimpleFormatter
