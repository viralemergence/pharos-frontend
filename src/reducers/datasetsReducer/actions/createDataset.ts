import { ActionFunction, DatasetsActions } from '../datasetsReducer'
import { DatasetStatus } from '../types'

export interface CreateDatasetAction {
  type: DatasetsActions.CreateDataset
  payload: CreateDatasetPayload
}

export interface CreateDatasetPayload {
  datasetID: string
  researcherID: string
  name: string
  date_collected: string
  samples_taken: string
  detection_run: string
  activeVersion: number
}

const createDataset: ActionFunction<CreateDatasetPayload> = (
  state,
  payload
) => {
  const newDataset = {
    status: DatasetStatus.Unsaved,
    ...payload,
    versions: [],
    activeVersion: 0,
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
