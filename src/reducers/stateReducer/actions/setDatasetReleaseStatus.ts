import { ActionFunction, StateActions } from '../stateReducer'
import { DatasetReleaseStatus, DatasetStatus } from '../types'

export interface SetDatasetReleaseStatusPayload {
  datasetID: string
  lastUpdated: string
  releaseStatus: DatasetReleaseStatus
}

export interface SetDatasetReleaseStatusAction {
  type: StateActions.SetDatasetReleaseStatus
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
      lastUpdated: payload.lastUpdated,
      releaseStatus: payload.releaseStatus,
      status: DatasetStatus.Unsaved,
    },
  },
})

export default setDatasetReleaseStatus
