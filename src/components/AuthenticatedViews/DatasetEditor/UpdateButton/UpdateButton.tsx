import React from 'react'
import { useParams } from 'react-router-dom'

import { ProjectActions } from 'reducers/projectReducer/projectReducer'
import { DatasetStatus, RegisterStatus } from 'reducers/projectReducer/types'

import MintButton from 'components/ui/MintButton'

import useProject from 'hooks/useProject'
import useUser from 'hooks/useUser'

import useDataset from 'hooks/useDatset'
import useRegisterStatus from 'hooks/useRegisterStatus'

const UpdateButton = () => {
  const [user] = useUser()
  const { id } = useParams()
  const [, projectDispatch] = useProject()

  const dataset = useDataset(id)
  const registerStatus = useRegisterStatus(id)

  // don't render the update button if there are no datasets loaded,
  // the project is loading, or there are no versions in the dataset
  if (!dataset || dataset.status === DatasetStatus.Error) return <></>

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

    const versionID = dataset.activeVersion
    const date = dataset.versions?.[versionID]?.date

    if (!date)
      throw new Error(
        `Version object date not found at datasetID: ${id} and versionID: ${versionID}`
      )

    // save version to the server and get back the server info like the key and date
    // const newVersionInfo = await saveVersion(
    //   rows,
    //   id,
    //   user.data?.researcherID,
    //   date
    // )

    console.log('save register to the server here')
    const saved = true

    // if it saved correctly, merge in the new info
    if (saved) {
      projectDispatch({
        type: ProjectActions.SetRegisterStatus,
        payload: {
          datasetID: id,
          status: RegisterStatus.Saved,
        },
      })
    } else {
      // else set the status to error
      projectDispatch({
        type: ProjectActions.SetRegisterStatus,
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
