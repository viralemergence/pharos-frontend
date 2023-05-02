import React from 'react'
import MintButton from 'components/ui/MintButton'

import useModal from 'hooks/useModal/useModal'
import useDatasetID from 'hooks/dataset/useDatasetID'
import useProjectID from 'hooks/project/useProjectID'
import useUser from 'hooks/useUser'
import useDispatch from 'hooks/useDispatch'
import { StateActions } from 'reducers/stateReducer/stateReducer'
import {
  DatasetReleaseStatus,
  ReleaseReport,
} from 'reducers/stateReducer/types'
import useReleaseButtonStatus from './useReleaseButtonStatus'
import ReleaseReportModal from './ReleaseReportModal'

const ReleaseButton = () => {
  const { researcherID } = useUser()
  const datasetID = useDatasetID()
  const projectID = useProjectID()
  const setModal = useModal()
  const projectDispatch = useDispatch()

  const { buttonDisabled, buttonMessage, setReleasing } =
    useReleaseButtonStatus()

  const onClickRelease = async (e: React.SyntheticEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setReleasing(true)
    const response = await fetch(
      `${process.env.GATSBY_API_URL}/release-dataset`,
      {
        method: 'POST',
        body: JSON.stringify({
          researcherID,
          projectID,
          datasetID,
        }),
      }
    ).catch(error => console.log(error))

    if (!response) return
    const report = await response.json()

    function reportIsReport(report: unknown): report is ReleaseReport {
      if (typeof report !== 'object') return false
      if (!report) return false
      if (!('releaseStatus' in report)) return false
      if (typeof report.releaseStatus !== 'string') return false
      if (!(report.releaseStatus in DatasetReleaseStatus)) return false
      return true
    }

    if (reportIsReport(report) && report.releaseStatus) {
      projectDispatch({
        type: StateActions.SetDatasetReleaseStatus,
        payload: {
          datasetID,
          releaseStatus: report.releaseStatus,
        },
      })

      setModal(<ReleaseReportModal report={report} />, { closeable: true })
    } else
      setModal(
        <pre style={{ margin: '20px' }}>Error parsing release report</pre>,
        { closeable: true }
      )

    setReleasing(false)
  }

  return (
    <MintButton onClick={e => onClickRelease(e)} disabled={buttonDisabled}>
      {buttonMessage}
    </MintButton>
  )
}

export default ReleaseButton
