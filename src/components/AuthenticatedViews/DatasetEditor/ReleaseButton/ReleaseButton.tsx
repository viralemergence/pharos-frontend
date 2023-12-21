import React from 'react'
import MintButton from 'components/ui/MintButton'

import useModal from 'hooks/useModal/useModal'
import useDatasetID from 'hooks/dataset/useDatasetID'
import useProjectID from 'hooks/project/useProjectID'
import useDispatch from 'hooks/useDispatch'
import { StateActions } from 'reducers/stateReducer/stateReducer'
import {
  DatasetReleaseStatus,
  // ReleaseReport,
} from 'reducers/stateReducer/types'
import useReleaseButtonStatus from './useReleaseButtonStatus'
import ReleaseReportModal from './ReleaseReportModal'
import { Auth } from 'aws-amplify'
import ReleaseResponseModal from './ReleaseResponseModal'

export interface ReleaseResponse {
  message: string
  error?: string
}

function responseIsReleaseResponse(
  releaseResponse: unknown
): releaseResponse is ReleaseResponse {
  if (typeof releaseResponse !== 'object') return false
  if (!releaseResponse) return false
  if (!('message' in releaseResponse)) return false
  if (typeof releaseResponse.message !== 'string') return false
  if ('error' in releaseResponse && typeof releaseResponse.error !== 'string')
    return false
  return true
}

const ReleaseButton = () => {
  const datasetID = useDatasetID()
  const projectID = useProjectID()
  const setModal = useModal()
  const projectDispatch = useDispatch()

  const { buttonDisabled, buttonInProgress, buttonMessage, setReleasing } =
    useReleaseButtonStatus()

  const onClickRelease = async (e: React.SyntheticEvent<HTMLButtonElement>) => {
    e.preventDefault()

    let userSession
    try {
      userSession = await Auth.currentSession()
    } catch (e) {
      console.error(e)
      return
    }

    setReleasing(true)
    const response = await fetch(
      `${process.env.GATSBY_API_URL}/release-dataset`,
      {
        method: 'POST',
        headers: new Headers({
          Authorization: userSession.getIdToken().getJwtToken(),
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify({
          projectID,
          datasetID,
        }),
      }
    ).catch(error => console.log(error))

    if (!response) return
    const releaseResponse = await response.json()

    // function reportIsReport(report: unknown): report is ReleaseReport {
    //   if (typeof report !== 'object') return false
    //   if (!report) return false
    //   if (!('releaseStatus' in report)) return false
    //   if (typeof report.releaseStatus !== 'string') return false
    //   if (!(report.releaseStatus in DatasetReleaseStatus)) return false
    //   return true
    // }

    // if (reportIsReport(report) && report.releaseStatus) {
    //   projectDispatch({
    //     type: StateActions.SetDatasetReleaseStatus,
    //     payload: {
    //       datasetID,
    //       releaseStatus: report.releaseStatus,
    //     },
    //   })

    if (responseIsReleaseResponse(releaseResponse)) {
      if (!response.ok)
        setModal(<ReleaseResponseModal releaseResponse={releaseResponse} />, {
          closeable: true,
        })
      else {
        setModal(null)
        projectDispatch({
          type: StateActions.SetDatasetReleaseStatus,
          payload: {
            datasetID,
            releaseStatus: DatasetReleaseStatus.Releasing,
          },
        })
      }
    } else
      setModal(
        <pre style={{ margin: '20px' }}>Error requesting dataset release</pre>,
        { closeable: true }
      )

    setReleasing(false)
  }

  return (
    <MintButton
      onClick={e => onClickRelease(e)}
      disabled={buttonDisabled}
      inProgress={buttonInProgress}
    >
      {buttonMessage}
    </MintButton>
  )
}

export default ReleaseButton
