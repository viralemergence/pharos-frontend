import { ActionFunction, ProjectActions } from '../projectReducer'
import { DatasetStatus, Version } from '../types'

export interface CreateDatasetAction {
  type: ProjectActions.CreateDataset
  payload: CreateDatasetPayload
}

export interface CreateDatasetPayload {
  datasetID: string
  researcherID: string
  name: string
  date_collected: string
  samples_taken?: string
  detection_run?: string
  status?: DatasetStatus
  versions?: Version[]
  activeVersion?: number
}

const createDataset: ActionFunction<CreateDatasetPayload> = (
  state,
  payload
) => {
  const newDataset = {
    // setting basic defaults
    status: DatasetStatus.Unsaved,
    versions: [],
    activeVersion: 0,
    samples_taken: '0',
    detection_run: '0',
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
