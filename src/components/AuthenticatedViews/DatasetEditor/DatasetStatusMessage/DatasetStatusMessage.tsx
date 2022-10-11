import React from 'react'
import styled from 'styled-components'
import useDataset from 'hooks/dataset/useDataset'
import { DatasetStatus, RegisterStatus } from 'reducers/stateReducer/types'
import { useTheme } from 'styled-components'

const Span = styled.span`
  ${({ theme }) => theme.extraSmallParagraph};
  font-style: italic;
  border-left: 1.5px solid ${({ theme }) => theme.medDarkGray};
  padding-left: 0.75em;
  margin-left: 0.75em;
`

const DatasetStatusMessage = (): JSX.Element => {
  const dataset = useDataset()
  const theme = useTheme()

  if (!dataset) return <Span style={{ color: theme.red }}>No dataset</Span>

  const registerStatus = dataset.registerStatus

  let datasetStatusMessage
  let color

  switch (true) {
    case registerStatus === RegisterStatus.Loading:
      datasetStatusMessage = 'Loading...'
      color = theme.orange
      break
    case dataset.status === DatasetStatus.Saved &&
      registerStatus === RegisterStatus.Saved:
      datasetStatusMessage = 'Saved'
      color = theme.medDarkGray
      break
    case dataset.status === DatasetStatus.Saving ||
      registerStatus === RegisterStatus.Saving:
      datasetStatusMessage = 'Saving...'
      color = theme.orange
      break
    case dataset.status === DatasetStatus.Unsaved ||
      registerStatus === RegisterStatus.Unsaved:
      datasetStatusMessage = 'Unsaved'
      color = theme.orange
      break
    case dataset.status === DatasetStatus.Error ||
      registerStatus === RegisterStatus.Error:
      datasetStatusMessage = 'Error'
      color = theme.red
      break
    default:
      datasetStatusMessage = 'Loading...'
      color = theme.orange
  }

  return <Span style={{ color }}>{datasetStatusMessage}</Span>
}

export default DatasetStatusMessage
