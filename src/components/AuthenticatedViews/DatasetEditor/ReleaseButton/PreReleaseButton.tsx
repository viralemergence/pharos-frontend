import React from 'react'

import MintButton from 'components/ui/MintButton'
import useModal from 'hooks/useModal/useModal'
import PreReleaseModal from './PreReleaseModal'
import useReleaseButtonStatus from './useReleaseButtonStatus'
import useDataset from 'hooks/dataset/useDataset'
import ReleaseReportModal from './ReleaseReportModal'
import { DatasetReleaseStatus } from 'reducers/stateReducer/types'

const PreReleaseButton = () => {
  const setModal = useModal()
  const dataset = useDataset()

  const { buttonDisabled, buttonInProgress, buttonMessage } =
    useReleaseButtonStatus()

  const handleClick = () => {
    if (
      dataset.releaseStatus === DatasetReleaseStatus.Unreleased &&
      dataset.releaseReport
    ) {
      setModal(<ReleaseReportModal report={dataset.releaseReport} />, {
        closeable: true,
      })
      return
    }

    setModal(<PreReleaseModal />, { closeable: true })
  }

  return (
    <MintButton
      disabled={buttonDisabled}
      inProgress={buttonInProgress}
      onClick={handleClick}
    >
      {buttonMessage}
    </MintButton>
  )
}

export default PreReleaseButton
