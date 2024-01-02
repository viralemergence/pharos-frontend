import React from 'react'
import styled from 'styled-components'

import { ReleaseResponse } from './ReleaseButton'
import MintButton from 'components/ui/MintButton'
import ColorMessage, {
  ColorMessageStatus,
} from 'components/ui/Modal/ColorMessage'

import useModal from 'hooks/useModal/useModal'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 500px;

  > h1 {
    ${({ theme }) => theme.h3};
  }
`

const Paragraph = styled.p`
  ${({ theme }) => theme.smallParagraph};
  color: ${({ theme }) => theme.black};
  margin: 0;
`

const MinWidthMintButton = styled(MintButton)`
  min-width: 10em;
  margin-top: 30px;
`
const ReleaseResponseModal = ({
  releaseResponse,
}: {
  releaseResponse: ReleaseResponse
}) => {
  const setModal = useModal()

  return (
    <Container>
      <h1>Release dataset</h1>
      <Paragraph>{releaseResponse.message}</Paragraph>
      {releaseResponse.error && (
        <ColorMessage status={ColorMessageStatus.Danger}>
          {releaseResponse.error}
        </ColorMessage>
      )}
      <MinWidthMintButton onClick={() => setModal(null)}>Ok</MinWidthMintButton>
    </Container>
  )
}

export default ReleaseResponseModal
