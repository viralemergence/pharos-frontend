import React from 'react'

import { ProjectActions } from 'reducers/projectReducer/projectReducer'
import { DatasetStatus } from 'reducers/projectReducer/types'

import MintButton from 'components/ui/MintButton'

import useUser from 'hooks/useUser'
import useDatasetID from 'hooks/dataset/useDatasetID'
import useDataset from 'hooks/dataset/useDataset'
import useProjectDispatch from 'hooks/project/useProjectDispatch'

const UpdateButton = () => {
  const user = useUser()
  const datasetID = useDatasetID()
  const projectDispatch = useProjectDispatch()

  const dataset = useDataset()

  // don't render the update button if there are no datasets loaded,
  // the project is loading, or there are no versions in the dataset
  if (!dataset || dataset.status === DatasetStatus.Error) return <></>

  let buttonMessage = 'Publish version'
  let buttonDisabled = false
  switch (true) {
    // if there are no versions, we can publish
    case dataset.versions.length === 0:
      buttonMessage = 'Publish Version'
      buttonDisabled = false
      break
    // if we're looking at an old version, it's published
    case dataset.activeVersion < dataset.versions.length - 1:
      buttonMessage = 'Version Published'
      buttonDisabled = true
      break
    case dataset.highestVersion > dataset.activeVersion:
      buttonMessage = 'Publish Version'
      buttonDisabled = false
      break
    default:
      buttonMessage = 'Version Published'
      buttonDisabled = true
      break
  }

  const onClickUpdate = async (e: React.SyntheticEvent<HTMLButtonElement>) => {
    e.preventDefault()

    if (!user.data?.researcherID) throw new Error('User data not found')

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
    <MintButton
      onClick={e => onClickUpdate(e)}
      disabled={buttonDisabled}
      style={{ marginLeft: 'auto' }}
    >
      {buttonMessage}
    </MintButton>
  )
}

export default UpdateButton
