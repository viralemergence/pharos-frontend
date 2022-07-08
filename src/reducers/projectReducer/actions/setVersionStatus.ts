import { ActionFunction, ProjectActions } from '../projectReducer'
import { VersionStatus } from '../types'

export interface SetVersionStatusPayload {
  datasetID: string
  status: VersionStatus
}

export interface SetVersionStatusAction {
  type: ProjectActions.SetVersionStatus
  payload: SetVersionStatusPayload
}

const setVersionStatus: ActionFunction<SetVersionStatusPayload> = (
  state,
  payload
) => {
  const activeVersion = state.datasets[payload.datasetID].activeVersion
  const nextVersions = [...(state.datasets[payload.datasetID].versions ?? [])]

  nextVersions[activeVersion] = {
    ...nextVersions[activeVersion],
    status: payload.status,
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

export default setVersionStatus
