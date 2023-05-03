import React from 'react'
import MintButton from 'components/ui/MintButton'

import useModal from 'hooks/useModal/useModal'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 15px;
  gap: 30px;

  > h1 {
    margin: 0;
    ${({ theme }) => theme.h3};
  }
`
const WarningMessage = styled.div`
  padding: 10px 10px;
  background-color: ${({ theme }) => theme.hoverOrange};
  border-radius: 5px;
  ${({ theme }) => theme.smallParagraph};
  color: ${({ theme }) => theme.black};
`
const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  gap: 15px;
`

export const CantEditPublished = () => {
  const setModal = useModal()

  return (
    <Container>
      <h1>Published dataset cannot be edited</h1>
      <WarningMessage>
        In order to edit your dataset, you must first unpublish your project.
      </WarningMessage>
      <ButtonContainer>
        <MintButton onClick={() => setModal(null)}>Ok</MintButton>
      </ButtonContainer>
    </Container>
  )
}
