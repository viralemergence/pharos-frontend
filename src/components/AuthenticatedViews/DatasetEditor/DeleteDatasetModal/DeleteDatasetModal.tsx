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
import { DatasetReleaseStatus } from 'reducers/stateReducer/types'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 550px;
  gap: 20px;
  padding: 25px;
`
const H1 = styled.h1`
  ${({ theme }) => theme.h3};
  margin: 0px;
`
const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  gap: 15px;
`
const Paragraph = styled.p`
  ${({ theme }) => theme.smallParagraph};
  color: ${({ theme }) => theme.black};
  margin: 10px 0px;
`

const DeleteDatasetModal = () => {
  const setModal = useModal()
  const project = useProject()
  const dataset = useDataset()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  return (
    <Container>
      <H1>Delete dataset</H1>
      <ColorMessage status={ColorMessageStatus.Danger} style={{ margin: 0 }}>
        Are you sure you want to permanently delete your dataset?
      </ColorMessage>
      <Paragraph>
        Deleting your dataset will permanently remove it from the Pharos
        database. You cannot undo this action.
        {dataset.releaseStatus === DatasetReleaseStatus.Published &&
          'If the data from this dataset was previously downloaded, ' +
            'these data will still be publicly accessible through the ' +
            'download citation link.'}
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
          Delete dataset
        </MintButton>
        <MintButton secondary onClick={() => setModal(null)}>
          Cancel
        </MintButton>
      </ButtonContainer>
    </Container>
  )
}

export default DeleteDatasetModal
