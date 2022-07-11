import React from 'react'
import { useParams } from 'react-router-dom'

import { ProjectActions } from 'reducers/projectReducer/projectReducer'
import { ProjectStatus, VersionStatus } from 'reducers/projectReducer/types'

import MintButton from 'components/ui/MintButton'

import useProject from 'hooks/useProject'
import useUser from 'hooks/useUser'

import saveVersion from 'api/uploadVersion'

const UpdateButton = () => {
  const [user] = useUser()
  const { id } = useParams()
  const [project, projectDispatch] = useProject()

  if (!id) throw new Error('Missing dataset ID url parameter')
  const dataset = project.datasets[id]

  // don't render the update button if there are no datasets loaded,
  // the project is loading, or there are no versions in the dataset
  if (
    !dataset ||
    project.status === ProjectStatus.Loading ||
    !dataset.versions ||
    dataset.versions.length === 0
  )
    return <></>

  const versionStatus =
    !dataset.versions || dataset.versions.length === 0
      ? VersionStatus.Unsaved
      : dataset.versions[dataset.activeVersion].status

  let buttonMessage = 'Save version'
  switch (versionStatus) {
    case VersionStatus.Saved:
      buttonMessage = 'Version saved'
      break
    case VersionStatus.Saving:
      buttonMessage = 'Saving...'
      break
    case VersionStatus.Unsaved:
      buttonMessage = 'Save Version'
      break
    case VersionStatus.Error:
      buttonMessage = 'Error'
  }

  const onClickUpdate = async (e: React.SyntheticEvent<HTMLButtonElement>) => {
    e.preventDefault()

    // set version status to saving
    projectDispatch({
      type: ProjectActions.SetVersionStatus,
      payload: {
        datasetID: id,
        status: VersionStatus.Saving,
      },
    })

    if (!user.data?.researcherID) throw new Error('User data not found')

    const versionID = project.datasets[id].activeVersion

    const rows = project.datasets[id].versions?.[versionID].rows
    const date = project.datasets[id].versions?.[versionID].date

    if (!rows)
      throw new Error(
        `Version object rows not found at datasetID: ${id} and versionID: ${versionID}`
      )

    if (!date)
      throw new Error(
        `Version object date not found at datasetID: ${id} and versionID: ${versionID}`
      )

    // save version to the server and get back the server info like the key and date
    const newVersionInfo = await saveVersion(
      rows,
      id,
      user.data?.researcherID,
      date
    )

    // if it saved correctly, merge in the new info
    if (newVersionInfo) {
      projectDispatch({
        type: ProjectActions.UpdateVersion,
        payload: {
          datasetID: id,
          version: {
            ...newVersionInfo,
            status: VersionStatus.Saved,
          },
        },
      })
    } else {
      // else set the status to error
      projectDispatch({
        type: ProjectActions.SetVersionStatus,
        payload: {
          datasetID: id,
          status: VersionStatus.Error,
        },
      })
    }
  }

  return (
    <MintButton
      onClick={e => onClickUpdate(e)}
      disabled={versionStatus !== VersionStatus.Unsaved}
    >
      {buttonMessage}
    </MintButton>
  )
}

export default UpdateButton
