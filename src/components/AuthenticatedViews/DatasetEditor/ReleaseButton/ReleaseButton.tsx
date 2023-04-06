import React, { useState } from 'react'

import MintButton from 'components/ui/MintButton'

import useModal from 'hooks/useModal/useModal'
import useDatasetID from 'hooks/dataset/useDatasetID'
import useUser from 'hooks/useUser'
import useDispatch from 'hooks/useDispatch'
import { StateActions } from 'reducers/stateReducer/stateReducer'
import {
  DatasetReleaseStatus,
  ReleaseReport,
} from 'reducers/stateReducer/types'
import useDataset from 'hooks/dataset/useDataset'

const ReleaseButton = () => {
  const { researcherID } = useUser()
  const dataset = useDataset()
  const datasetID = useDatasetID()
  const setModal = useModal()
  const projectDispatch = useDispatch()

  // const dataset = useDataset()

  // don't render the update button if there are no datasets loaded,
  // the project is loading, or there are no versions in the dataset
  // if (!dataset) return <></>

  const [releasing, setReleasing] = useState(false)

  const buttonMessage = releasing
    ? 'Loading...'
    : dataset.releaseStatus &&
      [DatasetReleaseStatus.Released, DatasetReleaseStatus.Published].includes(
        dataset.releaseStatus
      )
    ? 'Dataset released'
    : 'Release dataset'

  const buttonDisabled = releasing
  // switch (true) {
  //   // if there are no versions, we can publish
  //   case dataset.versions.length === 0:
  //     buttonMessage = 'Release dataset'
  //     buttonDisabled = false
  //     break
  //   // if we're looking at an old version, it's published
  //   case dataset.activeVersion < dataset.versions.length - 1:
  //     buttonMessage = 'Dataset released'
  //     buttonDisabled = true
  //     break
  //   case dataset.highestVersion > dataset.activeVersion:
  //     buttonMessage = 'Release dataset'
  //     buttonDisabled = false
  //     break
  //   default:
  //     buttonMessage = 'Dataset released'
  //     buttonDisabled = true
  //     break
  // }

  const onClickRelease = async (e: React.SyntheticEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setReleasing(true)
    const response = await fetch(
      `${process.env.GATSBY_API_URL}/release-dataset`,
      {
        method: 'POST',
        body: JSON.stringify({
          researcherID,
          datasetID,
        }),
      }
    ).catch(error => console.log(error))

    if (!response) return
    const report = await response.json()

    function reportIsReport(report: unknown): report is Partial<ReleaseReport> {
      if (typeof report !== 'object') return false
      if (!report) return false
      if (!('releaseStatus' in report)) return false
      if (typeof report.releaseStatus !== 'string') return false
      if (!(report.releaseStatus in DatasetReleaseStatus)) return false
      return true
    }

    if (reportIsReport(report) && report.releaseStatus)
      projectDispatch({
        type: StateActions.SetDatasetReleaseStatus,
        payload: {
          datasetID,
          releaseStatus: report.releaseStatus,
        },
      })

    setModal(
      <pre style={{ margin: '20px' }}>{JSON.stringify(report, null, 4)}</pre>,
      { closeable: true }
    )

    setReleasing(false)

    // const lastUpdated = getTimestamp()

    // projectDispatch({
    //   type: StateActions.CreateVersion,
    //   payload: {
    //     datasetID,
    //     version: {
    //       date: String(new Date().toUTCString()),
    //       name: String(new Date().toUTCString()),
    //     },
    //   },
    // })
  }

  return (
    <MintButton onClick={e => onClickRelease(e)} disabled={buttonDisabled}>
      {buttonMessage}
    </MintButton>
  )
}

export default ReleaseButton
