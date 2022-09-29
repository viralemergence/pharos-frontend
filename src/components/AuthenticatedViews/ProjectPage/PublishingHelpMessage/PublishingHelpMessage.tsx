import React from 'react'

import MintButton from 'components/ui/MintButton'
import TextButton from 'components/ui/TextButton'

import useModal from 'hooks/useModal/useModal'

const ModalMessage = () => {
  const setModal = useModal()

  return (
    <div style={{ maxWidth: '100%', width: 500 }}>
      <p>
        Publishing a project integrates all released datasets into the primary
        database, making the data available for download and integrating it into
        PHAROS visualizations and maps.
      </p>
      <MintButton onClick={() => setModal(null)} style={{ marginLeft: 'auto' }}>
        Ok
      </MintButton>
    </div>
  )
}

export const PublishingHelpMessage = () => {
  const setModal = useModal()

  return (
    <TextButton small onClick={() => setModal(<ModalMessage />)}>
      When do I publish?
    </TextButton>
  )
}

export default PublishingHelpMessage
