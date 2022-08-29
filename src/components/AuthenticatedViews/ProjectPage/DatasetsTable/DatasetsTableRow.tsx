import React from 'react'

import { Dataset } from 'reducers/projectReducer/types'
import formatDate from 'utilities/formatDate'

export const DatasetsTableRow = ({ dataset }: { dataset: Dataset }) => {
  let datesString: string
  switch (true) {
    case !dataset.earliestDate || !dataset.latestDate:
      datesString = '—'
      break

    case dataset.earliestDate &&
      dataset.latestDate &&
      dataset.earliestDate !== dataset.latestDate:
      datesString = `${formatDate(dataset.earliestDate!)} - ${formatDate(
        dataset.latestDate!
      )}`
      break

    case dataset.earliestDate &&
      dataset.latestDate &&
      dataset.earliestDate === dataset.latestDate:
      datesString = formatDate(dataset.earliestDate!)
      break

    default:
      datesString = '—'
  }

  const lastUpdated = dataset.lastUpdated
    ? new Date(dataset.lastUpdated).toLocaleString()
    : '—'

  return (
    <>
      <div>{dataset.name || '—'}</div>
      <div>{datesString}</div>
      <div>{dataset.displayStatus || '—'}</div>
      <div>{lastUpdated}</div>
    </>
  )
}
