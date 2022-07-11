import { ActionFunction, ProjectActions } from '../projectReducer'
import { Version, VersionStatus } from '../types'

export interface UpdateVersionPayload {
  datasetID: string
  version: Partial<Version>
}

export interface UpdateVersionAction {
  type: ProjectActions.UpdateVersion
  payload: UpdateVersionPayload
}

// action function to change views
const updateVersion: ActionFunction<UpdateVersionPayload> = (
  state,
  payload
) => {
  const activeVersion = state.datasets[payload.datasetID].activeVersion
  const nextVersions = [...state.datasets[payload.datasetID].versions]

  if (payload.version?.status === VersionStatus.Saved) {
    console.log('changing to saved status, resetting modified')
    nextVersions[activeVersion].rows = nextVersions[activeVersion].rows?.map(
      row => {
        for (const key in row) {
          row[key] = { ...row[key], modified: false }
        }
        return row
      }
    )
  }

  nextVersions[activeVersion] = {
    ...(nextVersions[activeVersion] ?? {
      date: new Date().toUTCString(),
      status: VersionStatus.Unsaved,
    }),
    ...payload.version,
  }

  return {
    ...state,
    datasets: {
      ...state.datasets,
      [payload.datasetID]: {
        ...state.datasets[payload.datasetID],
        versions: nextVersions,
      },
    },
  }
}

export default updateVersion
