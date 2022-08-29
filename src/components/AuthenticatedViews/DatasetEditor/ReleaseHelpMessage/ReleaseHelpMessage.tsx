import React from 'react'
import styled from 'styled-components'

import MintButton from 'components/ui/MintButton'

import useModal from 'hooks/useModal/useModal'

const Button = styled.button`
  background: none;
  border: none;
  ${({ theme }) => theme.extraSmallParagraph};
  color: ${({ theme }) => theme.veryDarkGray};
`

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
    <Button onClick={() => setModal(<ModalMessage />)}>
      When do I release?
    </Button>
  )
}

export default ReleaseHelpMessage
