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

  let backgroundColor: string
  switch (true) {
    case Number(datapoint.version) > versions.length:
      backgroundColor = 'orange'
      break
    default:
      backgroundColor = 'rgba(0,0,0,0)'
  }

  return <span style={{ backgroundColor }}>{datapoint.displayValue}</span>
}

export default SimpleFormatter
