import React from 'react'
import styled from 'styled-components'

import MintButton from 'components/ui/MintButton'

import useModalMessage from '../DatasetGrid/ModalMessage/useModalMessage'

const Button = styled.button`
  background: none;
  border: none;
  ${({ theme }) => theme.extraSmallParagraph};
  color: ${({ theme }) => theme.veryDarkGray};
`

const ModalMessage = () => {
  const setModalMessage = useModalMessage()

  return (
    <div>
      <p>
        Releasing a dataset marks all completed records as ready for publishing.
      </p>
      <MintButton
        onClick={() => setModalMessage(null)}
        style={{ marginLeft: 'auto' }}
      >
        Ok
      </MintButton>
    </div>
  )
}

export const ReleaseHelpMessage = () => {
  const setModalMessage = useModalMessage()

  return (
    <Button onClick={() => setModalMessage(<ModalMessage />)}>
      When do I release?
    </Button>
  )
}

export default ReleaseHelpMessage
