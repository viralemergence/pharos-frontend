import React, { useEffect } from 'react'
import styled from 'styled-components'
import { EditorProps } from 'react-data-grid'

import { Datapoint, RecordWithID } from 'reducers/stateReducer/types'
import { CellContainer } from '../DisplayComponents'
import MintButton from 'components/ui/MintButton'

import useModal from 'hooks/useModal/useModal'

import cellHighlightColors from '../../../../../../config/cellHighlightColors'

const ModalContainer = styled.div`
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
    <ModalContainer>
      <h1>Published dataset cannot be edited</h1>
      <WarningMessage>
        In order to edit your dataset, you must first unpublish your project.
      </WarningMessage>
      <ButtonContainer>
        <MintButton onClick={() => setModal(null)}>Ok</MintButton>
      </ButtonContainer>
    </ModalContainer>
  )
}

const EditingDisabledEditor = ({
  column,
  row: { [column.key]: datapoint },
}: EditorProps<RecordWithID>) => {
  const setModal = useModal()
  datapoint = datapoint as Datapoint

  const backgroundColor = datapoint.report?.status
    ? cellHighlightColors[datapoint.report.status]
    : 'white'

  useEffect(() => {
    setModal(<CantEditPublished />, { closeable: true })
    // disabling exhaustive-deps here because setModal()
    // is a setState() function.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <CellContainer style={{ backgroundColor, padding: '0px 16px' }}>
      <span>{datapoint?.dataValue}</span>
    </CellContainer>
  )
}

export default EditingDisabledEditor
