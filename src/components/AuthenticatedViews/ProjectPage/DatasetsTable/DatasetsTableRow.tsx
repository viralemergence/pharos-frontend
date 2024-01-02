import { TableCell } from 'components/ListTable/ListTable'
import { PublishedDataset } from 'components/PublicViews/ProjectPage/usePublishedProject'
import React from 'react'

import { Dataset, DatasetReleaseStatus } from 'reducers/stateReducer/types'

import formatDate from 'utilities/formatDate'
import { DatasetReleaseStatusChip } from '../PublishingStatusChip'

interface PublicViewDatasetsTableRowProps {
  publicView: true
  dataset: PublishedDataset
}

interface UnpublishedViewDatasetsTableRowProps {
  publicView?: false
  dataset: Dataset
}

type DatasetsTableRowProps =
  | PublicViewDatasetsTableRowProps
  | UnpublishedViewDatasetsTableRowProps

export const DatasetsTableRow = ({
  publicView,
  dataset,
}: DatasetsTableRowProps) => {
  let datesString = '—'
  if (!publicView) {
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
    }
  }

  const lastUpdated = dataset.lastUpdated
    ? new Date(dataset.lastUpdated).toLocaleString()
    : '—'

  let releaseMessage
  let releaseStatus
  if (!publicView) {
    releaseMessage =
      dataset.releaseStatus === 'Unreleased' && dataset.releaseReport
        ? `${dataset.releaseReport.failCount} errors`
        : dataset.releaseStatus
    releaseStatus =
      dataset.releaseStatus === 'Unreleased' && dataset.releaseReport
        ? DatasetReleaseStatus.Publishing
        : dataset.releaseStatus
  }

  return (
    <>
      <TableCell cardOrder={2}>{dataset.name || '—'}</TableCell>
      {!publicView && (
        <>
          <TableCell hideMedium>{datesString}</TableCell>
          <TableCell cardOrder={3}>
            <DatasetReleaseStatusChip status={releaseStatus}>
              {releaseMessage || '—'}
            </DatasetReleaseStatusChip>
          </TableCell>
          <TableCell cardOrder={1}>{lastUpdated}</TableCell>
        </>
      )}
    </>
  )
}
