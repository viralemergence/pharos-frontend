import MintButton from 'components/ui/MintButton'
import useModal from 'hooks/useModal/useModal'
import React from 'react'
import styled from 'styled-components'
import ReleaseButton from './ReleaseButton'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 500px;

  > h1 {
    ${({ theme }) => theme.h3};
  }
`
const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  gap: 15px;
`

const Paragraph = styled.p`
  ${({ theme }) => theme.smallParagraph};
  color: ${({ theme }) => theme.black};
`

const PreReleaseModal = () => {
  const setModal = useModal()

  return (
    <Container>
      <h1>Release dataset</h1>
      <Paragraph>
        Releasing your dataset marks it as complete and accurate and ready to be
        published to the public Pharos map. All released datasets will be
        published when you next publish this project.
      </Paragraph>
      <Paragraph>
        After publishing a dataset, you may retract publish if you want to make
        edits or additions to the dataset.
      </Paragraph>
      <ButtonContainer>
        <ReleaseButton />
        <MintButton secondary onClick={() => setModal(null)}>
          Keep editing
        </MintButton>
      </ButtonContainer>
    </Container>
  )
}

export default PreReleaseModal
