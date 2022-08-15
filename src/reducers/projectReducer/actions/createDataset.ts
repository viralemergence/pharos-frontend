import { ActionFunction, ProjectActions } from '../projectReducer'
import { Dataset, ProjectStatus } from '../types'

export interface CreateDatasetAction {
  type: ProjectActions.CreateDataset
  payload: Dataset
}

const createDataset: ActionFunction<Dataset> = (state, payload) => ({
  ...state,
  status: ProjectStatus.Unsaved,
  datasetIDs: [...state.datasetIDs, payload.datasetID],
  datasets: {
    ...state.datasets,
    [payload.datasetID]: { ...payload },
  },
})

export default createDataset
