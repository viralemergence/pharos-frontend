import { ActionFunction, DatasetsActions } from '../datasetsReducer'
import { VersionStatus } from '../types'

export interface SetVersionStatusPayload {
  datasetID: string
  status: VersionStatus
}

export interface SetVersionStatusAction {
  type: DatasetsActions.SetVersionStatus
  payload: SetVersionStatusPayload
}

const setVersionStatus: ActionFunction<SetVersionStatusPayload> = (
  state,
  payload
) => {
  const activeVersion = state.datasets[payload.datasetID].activeVersion
  const nextVersions = [...state.datasets[payload.datasetID].versions]

  nextVersions[activeVersion] = {
    ...nextVersions[activeVersion],
    status: payload.status,
  }
  console.log({ nextVersions })

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
