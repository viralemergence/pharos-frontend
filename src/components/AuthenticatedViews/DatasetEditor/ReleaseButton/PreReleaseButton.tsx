import React from 'react'

import MintButton from 'components/ui/MintButton'
import useModal from 'hooks/useModal/useModal'
import PreReleaseModal from './PreReleaseModal'
import useReleaseButtonStatus from './useReleaseButtonStatus'

const PreReleaseButton = () => {
  const setModal = useModal()

  const { buttonDisabled, buttonMessage } = useReleaseButtonStatus()

  return (
    <MintButton
      disabled={buttonDisabled}
      onClick={() => setModal(<PreReleaseModal />, { closeable: true })}
    >
      {buttonMessage}
    </MintButton>
  )
}

export default PreReleaseButton
