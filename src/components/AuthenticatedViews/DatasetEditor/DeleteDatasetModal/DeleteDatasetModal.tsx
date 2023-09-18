import React from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'

import ColorMessage, {
  ColorMessageStatus,
} from 'components/ui/Modal/ColorMessage'
import MintButton from 'components/ui/MintButton'
import { StateActions } from 'reducers/stateReducer/stateReducer'

import useModal from 'hooks/useModal/useModal'
import useDispatch from 'hooks/useDispatch'
import useProject from 'hooks/project/useProject'
import useDataset from 'hooks/dataset/useDataset'

import getTimestamp from 'utilities/getTimestamp'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 400px;
`
const H1 = styled.h1`
  ${({ theme }) => theme.h3};
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

const DeleteDatasetModal = () => {
  const setModal = useModal()
  const dispatch = useDispatch()
  const project = useProject()
  const dataset = useDataset()
  const navigate = useNavigate()

  return (
    <Container>
      <H1>Delete dataset</H1>
      <ColorMessage status={ColorMessageStatus.Danger}>
        Are you sure you want to permanently delete your dataset?
      </ColorMessage>
      <Paragraph>
        Deleting your dataset will permanently remove it from the Pharos
        database. You cannot undo this action.
      </Paragraph>
      <ButtonContainer>
        <MintButton
          onClick={() => {
            dispatch({
              type: StateActions.DeleteDataset,
              payload: {
                timestamp: getTimestamp(),
                projectID: project.projectID,
                dataset,
              },
            })
            setModal(null)
            navigate(`/projects/${project.projectID}`)
          }}
        >
          Delete project
        </MintButton>
        <MintButton secondary onClick={() => setModal(null)}>
          Cancel
        </MintButton>
      </ButtonContainer>
    </Container>
  )
}

export default DeleteDatasetModal
