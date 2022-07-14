import { ActionFunction, ProjectActions } from '../projectReducer'
import { Dataset } from '../types'

export interface CreateDatasetAction {
  type: ProjectActions.CreateDataset
  payload: CreateDatasetPayload
}

export interface CreateDatasetPayload extends Partial<Dataset> {
  name: Dataset['name']
  datasetID: Dataset['datasetID']
  researcherID: Dataset['researcherID']
}

const createDataset: ActionFunction<CreateDatasetPayload> = (
  state,
  payload
) => {
  const newDataset = {
    register: {},
    versions: [],
    activeVersion: 0,
    ...payload,
  }

  return {
    ...state,
    datasets: {
      ...state.datasets,
      [payload.datasetID]: newDataset,
    },
  }
}

export default createDataset
