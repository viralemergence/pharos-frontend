import { TableCell } from 'components/ListTable/ListTable'
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
      <TableCell mobileOrder={2}>{dataset.name || '—'}</TableCell>
      <TableCell hideMedium>{datesString}</TableCell>
      <TableCell mobileOrder={3}>
        <DatasetReleaseStatusChip status={dataset.releaseStatus}>
          {releaseMessage || '—'}
        </DatasetReleaseStatusChip>
      </TableCell>
      <TableCell mobileOrder={1}>{lastUpdated}</TableCell>
    </>
  )
}
