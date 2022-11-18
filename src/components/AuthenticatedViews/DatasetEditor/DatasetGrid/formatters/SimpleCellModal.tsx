import React from 'react'
import Modal from 'components/ui/Modal'
import { Datapoint, ReportScore } from 'reducers/stateReducer/types'
import styled from 'styled-components'
import cellHighlightColors from '../../../../../../config/cellHighlightColors'

interface SimpleCellModalProps {
  datapointID: string
  datapoint: Datapoint
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const Container = styled.div`
  display: flex;
  min-width: 650px;
  min-height: 300px;
  padding: 15px;
`
const SectionHeader = styled.h2`
  ${({ theme }) => theme.extraSmallParagraph};
  color: ${({ theme }) => theme.darkGray};
  margin: 0;
`
const Data = styled.div`
  flex-basis: 50%;
  padding: 0 10px;
`
const History = styled.div`
  flex-basis: 50%;
  border-left: 1px solid ${({ theme }) => theme.medGray};
  padding: 0px 10px;
  padding-left: 30px;
`
const Instructions = styled.div`
  margin-top: 15px;
  border-top: 1px solid ${({ theme }) => theme.medGray};
  padding-top: 15px;
`
const ReportContainer = styled.div<{ score?: ReportScore }>`
  margin-top: 15px;
  padding: 10px 15px;
  background-color: ${({ score }) =>
    score ? cellHighlightColors[score] : 'rgba(0,0,0,0)'};
  border-radius: 10px;
`
const Report = styled.p`
  padding: 0;
  margin: 0;
`
const HistoryName = styled.div`
  ${({ theme }) => theme.smallParagraph};
  color: ${({ theme }) => theme.black};
`
const HistoryModified = styled.div`
  ${({ theme }) => theme.extraSmallParagraph};
  color: ${({ theme }) => theme.darkGray};
`
const HistoryBlock = styled.div`
  margin-left: 15px;
  border-left: 1px solid ${({ theme }) => theme.medGray};
  padding-left: 10px;
  margin-bottom: 15px;
`

const getDatapointHistory = (
  datapoint: Datapoint,
  history: Datapoint[] = []
): Datapoint[] => {
  history = [...history, datapoint]
  if (!datapoint.previous) return history
  return getDatapointHistory(datapoint.previous, history)
}

const SimpleCellModal = ({
  datapointID,
  datapoint,
  open,
  setOpen,
}: SimpleCellModalProps) => {
  if (!open) return <></>

  const history = getDatapointHistory(datapoint)

  return (
    <Modal closeable {...{ open, setOpen }}>
      <Container>
        <Data>
          <SectionHeader>{datapointID}</SectionHeader>
          <label>{datapoint.displayValue}</label>
          {
            // <Instructions>
            // <SectionHeader>Directions</SectionHeader>
            // </Instructions>
          }
          <ReportContainer score={datapoint.report?.status}>
            <SectionHeader>Validation Report</SectionHeader>
            <Report>{datapoint.report?.message}</Report>
          </ReportContainer>
        </Data>
        <History>
          <SectionHeader>History</SectionHeader>
          {history &&
            history.map(datapoint => (
              <div key={datapoint.version}>
                {
                  // <HistoryName>{datapoint.modifiedBy}</HistoryName>
                }
                <HistoryModified>
                  {new Date(Number(datapoint.version)).toLocaleString()}
                </HistoryModified>
                <HistoryBlock>
                  <HistoryModified>{datapointID}</HistoryModified>
                  <HistoryName>{datapoint.displayValue}</HistoryName>
                </HistoryBlock>
              </div>
            ))}
        </History>
      </Container>
    </Modal>
  )
}

export default SimpleCellModal
