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
    dataset.versions.length === 0
      ? VersionStatus.Unsaved
      : dataset.versions.slice(-1)[0].status

  let buttonMessage = 'Update dataset'
  switch (versionStatus) {
    case VersionStatus.Saved:
      buttonMessage = 'Dataset saved'
      break
    case VersionStatus.Saving:
      buttonMessage = 'Saving...'
      break
    case VersionStatus.Unsaved:
      buttonMessage = 'Update dataset'
      break
    case VersionStatus.Error:
      buttonMessage = 'Error'
  }

  const onClickUpdate = async (e: React.SyntheticEvent<HTMLButtonElement>) => {
    e.preventDefault()
    console.log('start updating')

    datasetsDispatch({
      type: DatasetsActions.SetVersionStatus,
      payload: {
        datasetID: id,
        status: VersionStatus.Saving,
      },
    })

    if (!user.data?.researcherID) throw new Error('User data not found')

    const versionID = datasets.datasets[id].activeVersion

    const raw = datasets.datasets[id].versions[versionID].raw

    console.log(raw)

    if (!raw)
      throw new Error(
        `Raw version object not found at datasetID: ${id} and versionID: ${versionID}`
      )

    const newVersionInfo = await saveVersion(raw, id, user.data?.researcherID)

    console.log('after saving')

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
        !dataset.versions[dataset.activeVersion]?.raw
      }
    >
      {buttonMessage}
    </MintButton>
  )
}

export default UpdateButton
