import { ActionFunction, ProjectActions } from '../projectReducer'
import { Dataset, ProjectStatus } from '../types'

interface CreateDatasetPayload {
  updated: string
  dataset: Dataset
}

export interface CreateDatasetAction {
  type: ProjectActions.CreateDataset
  payload: CreateDatasetPayload
}

const createDataset: ActionFunction<CreateDatasetPayload> = (
  state,
  payload
) => ({
  ...state,
  lastUpdated: payload.updated,
  status: ProjectStatus.Unsaved,
  datasetIDs: [...state.datasetIDs, payload.dataset.datasetID],
  datasets: {
    ...state.datasets,
    [payload.dataset.datasetID]: { ...payload.dataset },
  },
})

export default createDataset
