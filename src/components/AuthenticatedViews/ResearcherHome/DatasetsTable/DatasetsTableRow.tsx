import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

import formatDate from 'utilities/formatDate'
import { lighten } from 'polished'
import { Dataset } from 'reducers/datasetsReducer/types'

const Row = styled(Link)`
  display: grid;
  grid-template-columns: 1.5fr 2.5fr repeat(4, 1.5fr);
  align-items: center;
  transition: 150ms ease;

  color: ${({ theme }) => theme.black};
  text-decoration: none;

  ${({ theme }) => theme.gridText};

  > div {
    padding: 15px;
  }

  &:nth-child(2n) {
    background: ${({ theme }) => theme.veryLightGray};
  }

  &:nth-of-type(1) {
    box-shadow: inset 0px 4px 4px #e0eae8;
  }

  &:hover {
    background-color: ${({ theme }) => lighten(0.05, theme.hoverMint)};
  }
`

export const HeaderRow = styled.div`
  display: grid;
  grid-template-columns: 1.5fr 2.5fr repeat(4, 1.5fr);
  align-items: center;
  > div {
    padding: 15px;
  }
`

export const GridRow = ({ dataset }: { dataset: Dataset }) => {
  const lastUpdatedDate =
    dataset.versions && dataset.versions.length > 0
      ? dataset.versions?.slice(-1)[0].date
      : new Date().toISOString()

  const lastUpdatedString = lastUpdatedDate ? formatDate(lastUpdatedDate) : '—'

  const collectedDate = dataset.date_collected
  const collectedDateString = collectedDate ? formatDate(collectedDate) : '—'

  return (
    <Row to={`/dataset/${dataset.datasetID}`}>
      <div>{dataset.datasetID}</div>
      <div>{dataset.name}</div>
      <div>{collectedDateString}</div>
      <div>{lastUpdatedString}</div>
      <div>{dataset.samples_taken || '—'}</div>
      <div>{dataset.detection_run || '—'}</div>
    </Row>
  )
}
