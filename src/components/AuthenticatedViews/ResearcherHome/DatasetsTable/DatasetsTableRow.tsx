import React from 'react'

import { Dataset } from 'reducers/projectReducer/types'
import { RowLink } from 'components/ListTable/ListTable'

import useProjectID from 'hooks/project/useProjectID'
import formatDate from 'utilities/formatDate'

export const GridRow = ({ dataset }: { dataset: Dataset }) => {
  const projectID = useProjectID()
  const lastUpdatedDate =
    dataset.versions && dataset.versions.length > 0
      ? dataset.versions?.slice(-1)[0].date
      : new Date().toISOString()

  const lastUpdatedString = lastUpdatedDate ? formatDate(lastUpdatedDate) : '—'

  const collectedDate = dataset.date_collected
  const collectedDateString = collectedDate ? formatDate(collectedDate) : '—'

  return (
    <RowLink to={`/project/${projectID}/${dataset.datasetID}`}>
      <div
        style={{
          textTransform: 'uppercase',
          fontFamily: 'monospace',
        }}
      >
        {dataset.datasetID}
      </div>
      <div>{dataset.name}</div>
      <div>{collectedDateString}</div>
      <div>{lastUpdatedString}</div>
      <div>{dataset.samples_taken || '—'}</div>
      <div>{dataset.detection_run || '—'}</div>
    </RowLink>
  )
}
