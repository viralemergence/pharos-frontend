import React from 'react'
import styled from 'styled-components'
import useDataset from 'hooks/dataset/useDataset'
import { NodeStatus } from 'reducers/stateReducer/types'
import { useTheme } from 'styled-components'
import useAppState from 'hooks/useAppState'
import useModal from 'hooks/useModal/useModal'

const Span = styled.span`
  ${({ theme }) => theme.extraSmallParagraph};
  font-style: italic;
  border-left: 1.5px solid ${({ theme }) => theme.medDarkGray};
  padding-left: 0.75em;
  margin-left: 0.75em;
`
const SecretButton = styled.button`
  background: none;
  border: none;
`

const DatasetStatusMessage = (): JSX.Element => {
  const dataset = useDataset()
  const theme = useTheme()
  const appState = useAppState()
  const setModal = useModal()

  if (!dataset) return <Span style={{ color: theme.red }}>No dataset</Span>

  const {
    messageStack,
    datasets: { status: datasetStatus },
    register: { status: registerStatus },
  } = appState

  const offline = typeof window !== 'undefined' && navigator.onLine === false

  // // show offline status if any message in the stack has a NetworkError status
  // const offline = Object.values(messageStack).reduce(
  //   (offline, message) =>
  //     offline || message.status === StorageMessageStatus.NetworkError,
  //   false
  // )

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
    case Object.values(messageStack).filter(
      message => message.target === 'remote'
    ).length > 0:
      datasetStatusMessage = `Syncing (${Object.keys(messageStack).length})`
      color = theme.orange
      break
    default:
      datasetStatusMessage = 'Loading...'
      color = theme.orange
  }

  return (
    <SecretButton
      onClick={() =>
        setModal(
          <pre style={{ padding: 15 }}>
            {JSON.stringify(appState.messageStack, null, 2)}
          </pre>,
          {
            closeable: true,
          }
        )
      }
    >
      <Span style={{ color }}>{datasetStatusMessage}</Span>
    </SecretButton>
  )
}

export default DatasetStatusMessage
