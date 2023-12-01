import { TableCell } from 'components/ListTable/ListTable'
import { PublishedDataset } from 'components/PublicViews/ProjectPage/usePublishedProject'
import React from 'react'

import { Dataset } from 'reducers/stateReducer/types'

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
  if (!publicView) {
    releaseMessage = dataset.releaseStatus
    // dataset.releaseStatus === DatasetReleaseStatus.Published
    //   ? 'Released'
    //   : dataset.releaseStatus
  }

  return (
    <>
      <TableCell cardOrder={2}>{dataset.name || '—'}</TableCell>
      {!publicView && (
        <>
          <TableCell hideMedium>{datesString}</TableCell>
          <TableCell cardOrder={3}>
            <DatasetReleaseStatusChip status={dataset.releaseStatus}>
              {releaseMessage || '—'}
            </DatasetReleaseStatusChip>
          </TableCell>
          <TableCell cardOrder={1}>{lastUpdated}</TableCell>
        </>
      )}
    </>
  )
}
