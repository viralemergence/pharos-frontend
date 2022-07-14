import React from 'react'
import { useParams } from 'react-router-dom'

import { ProjectActions } from 'reducers/projectReducer/projectReducer'
import { ProjectStatus, RegisterStatus } from 'reducers/projectReducer/types'

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

  const registerStatus = dataset.registerStatus ?? RegisterStatus.Unsaved

  let buttonMessage = 'Save version'
  switch (registerStatus) {
    case RegisterStatus.Saved:
      buttonMessage = 'Version saved'
      break
    case RegisterStatus.Saving:
      buttonMessage = 'Saving...'
      break
    case RegisterStatus.Unsaved:
      buttonMessage = 'Save Version'
      break
    case RegisterStatus.Error:
      buttonMessage = 'Error'
  }

  const onClickUpdate = async (e: React.SyntheticEvent<HTMLButtonElement>) => {
    e.preventDefault()

    // set version status to saving
    projectDispatch({
      type: ProjectActions.SetRegisterStatus,
      payload: {
        datasetID: id,
        status: RegisterStatus.Saving,
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
            status: RegisterStatus.Saved,
          },
        },
      })
    } else {
      // else set the status to error
      projectDispatch({
        type: ProjectActions.SetVersionStatus,
        payload: {
          datasetID: id,
          status: RegisterStatus.Error,
        },
      })
    }
  }

  return (
    <MintButton
      onClick={e => onClickUpdate(e)}
      disabled={registerStatus !== RegisterStatus.Unsaved}
      style={{ marginLeft: 'auto' }}
    >
      {buttonMessage}
    </MintButton>
  )
}

export default UpdateButton
