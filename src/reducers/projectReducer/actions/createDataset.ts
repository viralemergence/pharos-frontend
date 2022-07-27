import { ActionFunction, ProjectActions } from '../projectReducer'
import { Dataset } from '../types'

export interface CreateDatasetAction {
  type: ProjectActions.CreateDataset
  payload: Dataset
}

const createDataset: ActionFunction<Dataset> = (state, payload) => ({
  ...state,
  datasets: {
    ...state.datasets,
    [payload.datasetID]: { ...payload },
  },
})

export default createDataset
