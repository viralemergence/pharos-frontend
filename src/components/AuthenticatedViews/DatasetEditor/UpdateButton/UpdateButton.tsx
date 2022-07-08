import React from 'react'
import { useParams } from 'react-router-dom'

import { DatasetsActions } from 'reducers/datasetsReducer/datasetsReducer'
import { DatasetsStatus, VersionStatus } from 'reducers/datasetsReducer/types'

import MintButton from 'components/ui/MintButton'

import useDatasets from 'hooks/useDatasets'
import useUser from 'hooks/useUser'

import saveVersion from 'api/saveVersion'

const UpdateButton = () => {
  const [user] = useUser()
  const { id } = useParams()
  const [datasets, datasetsDispatch] = useDatasets()

  if (!id) throw new Error('Missing dataset ID url parameter')
  const dataset = datasets.datasets[id]

  if (datasets.status === DatasetsStatus.Loading) return <></>

  const versionStatus =
    !dataset.versions || dataset.versions.length === 0
      ? VersionStatus.Unsaved
      : dataset.versions.slice(-1)[0].status

  let buttonMessage = 'Update version'
  switch (versionStatus) {
    case VersionStatus.Saved:
      buttonMessage = 'Version saved'
      break
    case VersionStatus.Saving:
      buttonMessage = 'Saving...'
      break
    case VersionStatus.Unsaved:
      buttonMessage = 'Update Version'
      break
    case VersionStatus.Error:
      buttonMessage = 'Error'
  }

  const onClickUpdate = async (e: React.SyntheticEvent<HTMLButtonElement>) => {
    e.preventDefault()

    // set version status to saving
    datasetsDispatch({
      type: DatasetsActions.SetVersionStatus,
      payload: {
        datasetID: id,
        status: VersionStatus.Saving,
      },
    })

    if (!user.data?.researcherID) throw new Error('User data not found')

    const versionID = datasets.datasets[id].activeVersion

    const raw = datasets.datasets[id].versions?.[versionID].raw

    if (!raw)
      throw new Error(
        `Raw version object not found at datasetID: ${id} and versionID: ${versionID}`
      )

    // save version to the server and get back the server info like the key and date
    const newVersionInfo = await saveVersion(raw, id, user.data?.researcherID)

    // if it saved correctly, merge in the new info
    if (newVersionInfo) {
      datasetsDispatch({
        type: DatasetsActions.UpdateVersion,
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
      datasetsDispatch({
        type: DatasetsActions.SetVersionStatus,
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
      disabled={
        versionStatus === VersionStatus.Saved ||
        versionStatus === VersionStatus.Saving ||
        !dataset.versions?.[dataset.activeVersion]?.raw
      }
    >
      {buttonMessage}
    </MintButton>
  )
}

export default UpdateButton
