import React from 'react'

import { ProjectActions } from 'reducers/projectReducer/projectReducer'
import {
  DatasetReleaseStatus,
  DatasetStatus,
} from 'reducers/projectReducer/types'

import MintButton from 'components/ui/MintButton'

import useUser from 'hooks/useUser'
import useDatasetID from 'hooks/dataset/useDatasetID'
import useDataset from 'hooks/dataset/useDataset'
import useDispatch from 'hooks/project/useProjectDispatch'
import getTimestamp from 'utilities/getTimestamp'

const ReleaseButton = () => {
  const user = useUser()
  const datasetID = useDatasetID()
  const projectDispatch = useDispatch()

  const dataset = useDataset()

  // don't render the update button if there are no datasets loaded,
  // the project is loading, or there are no versions in the dataset
  if (!dataset || dataset.status === DatasetStatus.Error) return <></>

  let buttonMessage = 'Release dataset'
  let buttonDisabled = false
  switch (true) {
    // if there are no versions, we can publish
    case dataset.versions.length === 0:
      buttonMessage = 'Release dataset'
      buttonDisabled = false
      break
    // if we're looking at an old version, it's published
    case dataset.activeVersion < dataset.versions.length - 1:
      buttonMessage = 'Dataset released'
      buttonDisabled = true
      break
    case dataset.highestVersion > dataset.activeVersion:
      buttonMessage = 'Release dataset'
      buttonDisabled = false
      break
    default:
      buttonMessage = 'Dataset released'
      buttonDisabled = true
      break
  }

  const onClickUpdate = async (e: React.SyntheticEvent<HTMLButtonElement>) => {
    e.preventDefault()

    if (!user.data?.researcherID) throw new Error('User data not found')

    const lastUpdated = getTimestamp()

    projectDispatch({
      type: ProjectActions.SetDatasetReleaseStatus,
      payload: {
        datasetID,
        lastUpdated,
        releaseStatus: DatasetReleaseStatus.Released,
      },
    })

    projectDispatch({
      type: ProjectActions.CreateVersion,
      payload: {
        datasetID,
        version: {
          date: String(new Date().toUTCString()),
          name: String(new Date().toUTCString()),
        },
      },
    })
  }

  return (
    <MintButton onClick={e => onClickUpdate(e)} disabled={buttonDisabled}>
      {buttonMessage}
    </MintButton>
  )
}

export default ReleaseButton
