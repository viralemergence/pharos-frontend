import React from 'react'

import { ProjectActions } from 'reducers/projectReducer/projectReducer'
import { DatasetStatus, RegisterStatus } from 'reducers/projectReducer/types'

import MintButton from 'components/ui/MintButton'

import useUser from 'hooks/useUser'
import useDatasetID from 'hooks/dataset/useDatasetID'
import useDataset from 'hooks/dataset/useDataset'
import useRegisterStatus from 'hooks/register/useRegisterStatus'
import useProjectDispatch from 'hooks/project/useProjectDispatch'
import saveRegister from 'api/saveRegister'

const UpdateButton = () => {
  const user = useUser()
  const datasetID = useDatasetID()
  const projectDispatch = useProjectDispatch()

  const dataset = useDataset()
  const registerStatus = useRegisterStatus()

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

    const {
      data: { researcherID },
    } = user

    const version = {
      date: String(new Date().toUTCString()),
      name: String(new Date().toUTCString()),
    }

    // set register status to saving
    projectDispatch({
      type: ProjectActions.SetRegisterStatus,
      payload: { datasetID, status: RegisterStatus.Saving },
    })

    // create a version
    projectDispatch({
      type: ProjectActions.CreateVersion,
      payload: { datasetID, version },
    })

    // save the register to the server
    const key = await saveRegister({
      datasetID,
      researcherID,
      rows: {
        register: dataset.register,
        versions: [...dataset.versions, version],
      },
    })

    // if it saved correctly, merge in the new info
    if (key) {
      // set register key to the new one
      projectDispatch({
        type: ProjectActions.SetRegisterKey,
        payload: { datasetID, key },
      })
      // set the register status to saved
      projectDispatch({
        type: ProjectActions.SetRegisterStatus,
        payload: { datasetID, status: RegisterStatus.Saved },
      })
    } else {
      // else set the status to error
      projectDispatch({
        type: ProjectActions.SetRegisterStatus,
        payload: { datasetID, status: RegisterStatus.Error },
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
