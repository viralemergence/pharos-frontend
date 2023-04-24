import React from 'react'

import { Dataset, DatasetReleaseStatus } from 'reducers/stateReducer/types'

import formatDate from 'utilities/formatDate'
import { DatasetReleaseStatusChip } from '../PublishingStatusChip'

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

  const releaseMessage =
    dataset.releaseStatus === DatasetReleaseStatus.Published
      ? 'Released'
      : dataset.releaseStatus

  return (
    <>
      <div>{dataset.name || '—'}</div>
      <div>{datesString}</div>
      <div>
        <DatasetReleaseStatusChip status={dataset.releaseStatus}>
          {releaseMessage || '—'}
        </DatasetReleaseStatusChip>
      </div>
      <div>{lastUpdated}</div>
    </>
  )
}
