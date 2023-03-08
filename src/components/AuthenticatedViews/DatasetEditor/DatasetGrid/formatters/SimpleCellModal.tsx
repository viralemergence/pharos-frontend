import React from 'react'
import Modal from 'components/ui/Modal'
import { Datapoint, ReportScore } from 'reducers/stateReducer/types'
import styled from 'styled-components'
import cellHighlightColors from '../../../../../../config/cellHighlightColors'
import columnsMetadata from '../../../../../../config/defaultColumns.json'

interface SimpleCellModalProps {
  datapointID: string
  datapoint: Datapoint
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const Container = styled.div`
  display: flex;
  gap: 30px;
  min-width: 650px;
  max-width: 900px;
  min-height: 300px;
  padding: 15px;
`
const Header = styled.h1`
  ${({ theme }) => theme.h3};
  color: ${({ theme }) => theme.black};
  margin: 0 0 20px 0;
`
const ValueContainer = styled.div`
  ${({ theme }) => theme.bigParagraph};
  background-color: ${({ theme }) => theme.veryLightGray};
  color: ${({ theme }) => theme.black};
  border: 1px solid ${({ theme }) => theme.black};
  padding: 8px 10px;
`
const SectionHeader = styled.h2`
  ${({ theme }) => theme.extraSmallParagraph};
  color: ${({ theme }) => theme.darkGray};
  margin: 30px 0 0 0;
`
const Data = styled.div`
  flex-grow: 1;
  padding: 10px 0;
`
const History = styled.div`
  flex-basis: 33%;
  border-left: 1px solid ${({ theme }) => theme.medGray};
  padding: 0px 10px;
  padding-left: 30px;
`
const Instructions = styled.div`
  margin-top: 30px;
  border-top: 1px solid ${({ theme }) => theme.medGray};
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

  type ColumnKey = keyof typeof columnsMetadata.columns

  return (
    <Modal closeable {...{ open, setOpen }}>
      <Container
        onClick={e => {
          e.preventDefault()
          e.stopPropagation()
          console.log(e)
        }}
      >
        <Data>
          <Header>{datapointID}</Header>
          <ValueContainer>{datapoint.displayValue}</ValueContainer>
          <SectionHeader>Validation Report</SectionHeader>
          <ReportContainer score={datapoint.report?.status}>
            <Report>{datapoint.report?.message}</Report>
          </ReportContainer>
          <Instructions>
            <SectionHeader>Definition</SectionHeader>
            <p>
              {columnsMetadata.columns[datapointID as ColumnKey].definition}
            </p>
          </Instructions>
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
