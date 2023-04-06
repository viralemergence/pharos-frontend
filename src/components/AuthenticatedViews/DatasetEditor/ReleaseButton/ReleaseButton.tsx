import React, { useState } from 'react'

import MintButton from 'components/ui/MintButton'

import useModal from 'hooks/useModal/useModal'
import useDatasetID from 'hooks/dataset/useDatasetID'
import useUser from 'hooks/useUser'
import useDispatch from 'hooks/useDispatch'
import { StateActions } from 'reducers/stateReducer/stateReducer'
import {
  DatasetReleaseStatus,
  NodeStatus,
  ReleaseReport,
} from 'reducers/stateReducer/types'
import useDataset from 'hooks/dataset/useDataset'
import useAppState from 'hooks/useAppState'
import { StorageMessageStatus } from 'storage/synchronizeMessageQueue'

const ReleaseButton = () => {
  const { researcherID } = useUser()
  const dataset = useDataset()
  const datasetID = useDatasetID()
  const setModal = useModal()
  const projectDispatch = useDispatch()
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

  const onClickRelease = async (e: React.SyntheticEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setReleasing(true)
    const response = await fetch(
      `${process.env.GATSBY_API_URL}/release-dataset`,
      {
        method: 'POST',
        body: JSON.stringify({
          researcherID,
          datasetID,
        }),
      }
    ).catch(error => console.log(error))

    if (!response) return
    const report = await response.json()

    function reportIsReport(report: unknown): report is Partial<ReleaseReport> {
      if (typeof report !== 'object') return false
      if (!report) return false
      if (!('releaseStatus' in report)) return false
      if (typeof report.releaseStatus !== 'string') return false
      if (!(report.releaseStatus in DatasetReleaseStatus)) return false
      return true
    }

    if (reportIsReport(report) && report.releaseStatus)
      projectDispatch({
        type: StateActions.SetDatasetReleaseStatus,
        payload: {
          datasetID,
          releaseStatus: report.releaseStatus,
        },
      })

    setModal(
      <pre style={{ margin: '20px' }}>{JSON.stringify(report, null, 4)}</pre>,
      { closeable: true }
    )

    setReleasing(false)
  }

  return (
    <MintButton onClick={e => onClickRelease(e)} disabled={buttonDisabled}>
      {buttonMessage}
    </MintButton>
  )
}

export default ReleaseButton
