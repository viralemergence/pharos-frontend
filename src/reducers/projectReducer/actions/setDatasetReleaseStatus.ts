import { ActionFunction, ProjectActions } from '../projectReducer'
import { DatasetReleaseStatus } from '../types'

export interface SetDatasetReleaseStatusPayload {
  datasetID: string
  lastUpdated: string
  releaseStatus: DatasetReleaseStatus
}

export interface SetDatasetReleaseStatusAction {
  type: ProjectActions.SetDatasetReleaseStatus
  payload: SetDatasetReleaseStatusPayload
}

const setDatasetReleaseStatus: ActionFunction<
  SetDatasetReleaseStatusPayload
> = (state, payload) => ({
  ...state,
  datasets: {
    ...state.datasets,
    [payload.datasetID]: {
      ...state.datasets[payload.datasetID],
      releaseStatus: payload.releaseStatus,
    },
  },
})

export default setDatasetReleaseStatus
