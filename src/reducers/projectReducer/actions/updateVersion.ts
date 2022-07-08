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
  const nextVersions = [...(state.datasets[payload.datasetID].versions ?? [])]

  nextVersions[activeVersion] = {
    ...(state.datasets[payload.datasetID].versions?.[activeVersion] ?? {
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
