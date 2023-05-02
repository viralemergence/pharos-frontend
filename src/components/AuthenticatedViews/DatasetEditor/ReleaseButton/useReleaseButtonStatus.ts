import useDataset from 'hooks/dataset/useDataset'
import useAppState from 'hooks/useAppState'
import { useState } from 'react'
import { DatasetReleaseStatus, NodeStatus } from 'reducers/stateReducer/types'
import { StorageMessageStatus } from 'storage/synchronizeMessageQueue'

const useReleaseButtonStatus = () => {
  const dataset = useDataset()
  const { datasets, register, messageStack } = useAppState()
  const [releasing, setReleasing] = useState(false)

  // show offline status if any message in the stack has a NetworkError status
  const offline = Object.values(messageStack).reduce(
    (offline, message) =>
      offline || message.status === StorageMessageStatus.NetworkError,
    false
  )

  let buttonDisabled
  let buttonMessage
  switch (true) {
    case releasing === true:
      buttonMessage = 'Validating...'
      buttonDisabled = true
      break
    case offline:
      buttonMessage = 'Offline'
      buttonDisabled = true
      break
    case datasets.status === NodeStatus.Loading ||
      register.status === NodeStatus.Loading:
      buttonMessage = 'Loading...'
      buttonDisabled = true
      break
    case Object.values(messageStack).filter(
      message => message.target === 'remote'
    ).length > 0:
      buttonMessage = 'Syncing...'
      buttonDisabled = true
      break
    case dataset.releaseStatus === DatasetReleaseStatus.Unreleased:
      buttonMessage = 'Release dataset'
      buttonDisabled = false
      break
    case dataset.releaseStatus === DatasetReleaseStatus.Released:
      buttonMessage = 'Dataset released'
      buttonDisabled = true
      break
    case dataset.releaseStatus === DatasetReleaseStatus.Published:
      buttonMessage = 'Dataset published'
      buttonDisabled = true
      break
    default:
      buttonMessage = 'Offline'
      buttonDisabled = true
      break
  }

  return { buttonDisabled, buttonMessage, setReleasing }
}

export default useReleaseButtonStatus