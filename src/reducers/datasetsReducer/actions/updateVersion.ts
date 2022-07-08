import { ActionFunction, DatasetsActions } from '../datasetsReducer'
import { Version, VersionStatus } from '../types'

export interface UpdateVersionPayload {
  datasetID: string
  version: Partial<Version>
}

export interface UpdateVersionAction {
  type: DatasetsActions.UpdateVersion
  payload: UpdateVersionPayload
}

// action function to change views
const updateVersion: ActionFunction<UpdateVersionPayload> = (
  state,
  payload
) => {
  const activeVersion = state.datasets[payload.datasetID].activeVersion
  const nextVersions = [...(state.datasets[payload.datasetID].versions ?? [])]

  nextVersions[activeVersion] = {
    ...(state.datasets[payload.datasetID].versions?.[activeVersion] ?? {
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
