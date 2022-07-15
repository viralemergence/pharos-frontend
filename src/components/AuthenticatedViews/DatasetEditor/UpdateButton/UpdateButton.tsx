import React from 'react'
import { useParams } from 'react-router-dom'

import { ProjectActions } from 'reducers/projectReducer/projectReducer'
import { DatasetStatus, RegisterStatus } from 'reducers/projectReducer/types'

import MintButton from 'components/ui/MintButton'

import useUser from 'hooks/useUser'

import useProject from 'hooks/useProject'
import useDataset from 'hooks/useDataset'
import useRegisterStatus from 'hooks/useRegisterStatus'

const UpdateButton = () => {
  const [user] = useUser()
  const { id: datasetID } = useParams()
  if (!datasetID) throw new Error('Dataset ID not found in url params')
  const [, projectDispatch] = useProject()

  const dataset = useDataset(datasetID)
  const registerStatus = useRegisterStatus(datasetID)

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
    if (!user.data?.researcherID) throw new Error('User data not found')

    // set register status to saving
    projectDispatch({
      type: ProjectActions.SetRegisterStatus,
      payload: {
        datasetID,
        status: RegisterStatus.Saving,
      },
    })

    // create a version
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

    console.log('save register to the server here')
    const saved = true

    // if it saved correctly, merge in the new info
    if (saved) {
      projectDispatch({
        type: ProjectActions.SetRegisterStatus,
        payload: {
          datasetID,
          status: RegisterStatus.Saved,
        },
      })
    } else {
      // else set the status to error
      projectDispatch({
        type: ProjectActions.SetRegisterStatus,
        payload: {
          datasetID,
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
