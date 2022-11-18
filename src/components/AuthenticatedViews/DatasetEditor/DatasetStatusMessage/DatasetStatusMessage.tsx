import React from 'react'
import styled from 'styled-components'
import useDataset from 'hooks/dataset/useDataset'
import { NodeStatus } from 'reducers/stateReducer/types'
import { useTheme } from 'styled-components'
import useAppState from 'hooks/useAppState'
import { StorageMessageStatus } from 'storage/synchronizeMessageQueue'

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
  const appState = useAppState()

  if (!dataset) return <Span style={{ color: theme.red }}>No dataset</Span>

  const {
    messageStack,
    datasets: { status: datasetStatus },
    register: { status: registerStatus },
  } = appState

  // show offline status if any message in the stack has a NetworkError status
  const offline = Object.values(messageStack).reduce(
    (offline, message) =>
      offline || message.status === StorageMessageStatus.NetworkError,
    false
  )

  let datasetStatusMessage
  let color

  switch (true) {
    case datasetStatus === NodeStatus.Loading ||
      registerStatus === NodeStatus.Loading:
      datasetStatusMessage = 'Loading...'
      color = theme.orange
      break
    case offline:
      datasetStatusMessage = 'Saved Offline'
      color = theme.medDarkGray
      break
    case Object.keys(messageStack).length === 0:
      datasetStatusMessage = 'Saved'
      color = theme.medDarkGray
      break
    case Object.keys(messageStack).length > 0:
      datasetStatusMessage = 'Syncing...'
      color = theme.orange
      break
    default:
      datasetStatusMessage = 'Loading...'
      color = theme.orange
  }

  return <Span style={{ color }}>{datasetStatusMessage}</Span>
}

export default DatasetStatusMessage
