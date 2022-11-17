import React from 'react'

import MintButton from 'components/ui/MintButton'
import TextButton from 'components/ui/TextButton'

import useModal from 'hooks/useModal/useModal'

const ModalMessage = () => {
  const setModal = useModal()

  return (
    <div>
      <p>
        Releasing a dataset marks all completed records as ready for publishing.
      </p>
      <MintButton onClick={() => setModal(null)} style={{ marginLeft: 'auto' }}>
        Ok
      </MintButton>
    </div>
  )
}

export const ReleaseHelpMessage = () => {
  const setModal = useModal()

  return (
    <TextButton small onClick={() => setModal(<ModalMessage />)}>
      When do I release?
    </TextButton>
  )
}

export default ReleaseHelpMessage
