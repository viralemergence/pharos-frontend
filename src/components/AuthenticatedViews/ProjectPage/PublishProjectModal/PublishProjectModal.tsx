import React from 'react'
import styled from 'styled-components'

import MintButton from 'components/ui/MintButton'

import useModalMessage from 'components/AuthenticatedViews/DatasetEditor/DatasetGrid/ModalMessage/useModalMessage'

const Container = styled.div`
  display: flex;
  flex-direction: column;
`

const PublishProjectModal = () => {
  const setModalMessage = useModalMessage()

  return (
    <Container>
      <h3>Publish project dialog</h3>
      <p>Information and controls for publishing projects will be here.</p>
      <MintButton
        style={{ marginLeft: 'auto' }}
        onClick={() => setModalMessage(null)}
      >
        Close
      </MintButton>
    </Container>
  )
}

export default PublishProjectModal
