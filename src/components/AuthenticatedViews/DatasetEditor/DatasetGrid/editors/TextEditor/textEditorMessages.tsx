import React from 'react'
import MintButton from 'components/ui/MintButton'

import useModal from 'hooks/useModal/useModal'
import styled from 'styled-components'

interface IDMustBeUniqueProps {
  recordIDColumn: string
}

export const IDMustBeUnique = ({ recordIDColumn }: IDMustBeUniqueProps) => {
  const setModal = useModal()

  return (
    <div style={{ maxWidth: 500 }}>
      <h3>{recordIDColumn} must be unique within the dataset</h3>
      <p>
        Unique {recordIDColumn} values are used for merging new data from
        imported CSVs, so non-unique SampleIDs would make future updates
        ambiguous.
      </p>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <MintButton onClick={() => setModal(null)}>ok</MintButton>
      </div>
    </div>
  )
}

interface OnlyEditMostRecentProps {
  latestVersion: number
}

export const OnlyEditMostRecent = ({
  latestVersion,
}: OnlyEditMostRecentProps) => {
  // const datasetID = useDatasetID()
  const setModal = useModal()
  // const projectDispatch = useDispatch()

  return (
    <>
      <h3 style={{}}>Only the most recent version can be edited</h3>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <MintButton onClick={() => setModal(null)}>ok</MintButton>
        <MintButton
          style={{ marginLeft: 15 }}
          secondary
          onClick={() => {
            console.log('reimplement SetActiveVersion', latestVersion)
            // projectDispatch({
            //   type: StateActions.SetActiveVersion,
            //   payload: { datasetID, version: latestVersion },
            // })
            setModal(null)
          }}
        >
          Go to most recent
        </MintButton>
      </div>
    </>
  )
}

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
