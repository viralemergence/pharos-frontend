import React from 'react'

import { Dataset } from 'reducers/projectReducer/types'

import formatDate from 'utilities/formatDate'

export const DatasetInfo = ({ dataset }: { dataset: Dataset }) => {
  const lastUpdatedDate =
    dataset.versions && dataset.versions.length > 0
      ? dataset.versions?.slice(-1)[0].date
      : new Date().toISOString()

  const lastUpdatedString = lastUpdatedDate ? formatDate(lastUpdatedDate) : '—'

  const collectedDate = dataset.date_collected
  const collectedDateString = collectedDate ? formatDate(collectedDate) : '—'

  return (
    <>
      <div
        style={{
          textTransform: 'uppercase',
          fontFamily: 'monospace',
        }}
      >
        {dataset.datasetID}
      </div>
      <div>{dataset.name}</div>
      <div>-</div>
      <div>-</div>
    </>
  )
}
