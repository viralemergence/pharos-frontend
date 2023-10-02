import { TableCell } from 'components/ListTable/ListTable'
import { PublishedDataset } from 'components/PublicViews/ProjectPage/usePublishedProject'
import { MintToolbarMoreMenuButton } from 'components/ui/MintToolbar/MintToolbar'
import DeleteIcon from 'components/ui/MintToolbar/MintToolbarIcons/DeleteIcon'
import useModal from 'hooks/useModal/useModal'
import React from 'react'
import { Link } from 'react-router-dom'

import { Dataset, DatasetReleaseStatus } from 'reducers/stateReducer/types'
import styled from 'styled-components'

// import formatDate from 'utilities/formatDate'
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

const DatasetsTableDeleteButton = styled.button`
  background: none;
  border: none;
`

export const DatasetsTableRow = ({
  publicView,
  dataset,
}: DatasetsTableRowProps) => {
  const setModal = useModal()
  // Commenting out the Collection Dates because we don't
  // have time for the full implementation (even though it
  // would be pretty quick).
  // let datesString = '—'
  // if (!publicView) {
  //   switch (true) {
  //     case !dataset.earliestDate || !dataset.latestDate:
  //       datesString = '—'
  //       break

  //     case dataset.earliestDate &&
  //       dataset.latestDate &&
  //       dataset.earliestDate !== dataset.latestDate:
  //       datesString = `${formatDate(dataset.earliestDate!)} - ${formatDate(
  //         dataset.latestDate!
  //       )}`
  //       break

  //     case dataset.earliestDate &&
  //       dataset.latestDate &&
  //       dataset.earliestDate === dataset.latestDate:
  //       datesString = formatDate(dataset.earliestDate!)
  //       break
  //   }
  // }

  const lastUpdated = dataset.lastUpdated
    ? new Date(dataset.lastUpdated).toLocaleString()
    : '—'

  let releaseMessage
  if (!publicView) {
    releaseMessage =
      dataset.releaseStatus === DatasetReleaseStatus.Published
        ? 'Released'
        : dataset.releaseStatus
  }

  return (
    <>
      <TableCell cardOrder={2}>
        {publicView ? (
          dataset.name || '—'
        ) : (
          <Link to={`/projects/${dataset.projectID}/${dataset.datasetID}`}>
            {dataset.name || '—'}
          </Link>
        )}
      </TableCell>

      {!publicView && (
        <>
          {
            // <TableCell hideMedium>{datesString}</TableCell>
          }
          <TableCell cardOrder={3}>
            <DatasetReleaseStatusChip status={dataset.releaseStatus}>
              {releaseMessage || '—'}
            </DatasetReleaseStatusChip>
          </TableCell>
        </>
      )}
      <TableCell cardOrder={1}>{lastUpdated}</TableCell>
      {!publicView && (
        <DatasetsTableDeleteButton
          onClick={() => setModal('Delete dataset', { closeable: true })}
        >
          <DeleteIcon />
        </DatasetsTableDeleteButton>
      )}
    </>
  )
}
