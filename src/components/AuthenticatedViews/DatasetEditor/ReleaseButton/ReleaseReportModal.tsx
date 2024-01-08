import MintButton from 'components/ui/MintButton'
import useModal from 'hooks/useModal/useModal'
import React from 'react'
import {
  DatasetReleaseStatus,
  ReleaseReport,
} from 'reducers/stateReducer/types'
import styled from 'styled-components'

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
`
const MinWidthMintButton = styled(MintButton)`
  min-width: 10em;
`
const ReleaseResultBox = styled.div<{ status: DatasetReleaseStatus }>`
  width: 100%;
  padding: 10px 20px;
  border-radius: 5px;
  background-color: ${({ theme, status }) =>
    status === DatasetReleaseStatus.Released
      ? theme.lightMint
      : theme.hoverRed};
`

const Ul = styled.ol`
  margin-top: 0;
  margin-bottom: 30px;
`

const ReleaseReportModal = ({ report }: { report: ReleaseReport }) => {
  const setModal = useModal()

  if (report.releaseStatus === DatasetReleaseStatus.Released)
    return (
      <Container>
        <h1>Release dataset</h1>
        <ReleaseResultBox status={report.releaseStatus}>
          Dataset is released!
        </ReleaseResultBox>
        <Paragraph>
          This dataset is released and ready to be published to the public
          Pharos database, but it will not be public until the project is
          published.
        </Paragraph>
        <MinWidthMintButton onClick={() => setModal(null)}>
          Ok
        </MinWidthMintButton>
      </Container>
    )

  const errorColumns = [
    ...new Set(
      Object.values(report.failFields)
        .map(row => row.map(col => col))
        .flat()
    ),
  ]

  const missingColumns = [
    ...new Set(
      Object.values(report.missingFields)
        .map(row => row.map(col => col))
        .flat()
    ),
  ]

  const warningColumns = [
    ...new Set(
      Object.values(report.warningFields)
        .map(row => row.map(col => col))
        .flat()
    ),
  ]

  return (
    <Container>
      <h1>Release dataset</h1>
      <ReleaseResultBox status={report.releaseStatus}>
        Dataset is not ready to release.
      </ReleaseResultBox>
      {errorColumns.length > 0 && (
        <>
          <Paragraph>The following columns contain errors:</Paragraph>
          <Ul>
            {errorColumns.map(col => (
              <li key={col}>{col}</li>
            ))}
          </Ul>
        </>
      )}
      {missingColumns.length > 0 && (
        <>
          <Paragraph>The following columns are missing values:</Paragraph>
          <Ul>
            {missingColumns.map(col => (
              <li key={col}>{col}</li>
            ))}
          </Ul>
        </>
      )}
      {warningColumns.length > 0 && (
        <>
          <Paragraph>The following columns are warning values:</Paragraph>
          <Ul>
            {warningColumns.map(col => (
              <li key={col}>{col}</li>
            ))}
          </Ul>
        </>
      )}
      <MinWidthMintButton onClick={() => setModal(null)}>Ok</MinWidthMintButton>
    </Container>
  )
}

export default ReleaseReportModal
