import {
  APIRoutes,
  StorageMessageStatus,
} from 'storage/synchronizeMessageQueue'
import { ActionFunction, StateActions } from '../stateReducer'
import { DatasetReleaseStatus } from '../types'

export interface SetDatasetReleaseStatusPayload {
  datasetID: string
  releaseStatus: DatasetReleaseStatus
}

export interface SetDatasetReleaseStatusAction {
  type: StateActions.SetDatasetReleaseStatus
  payload: SetDatasetReleaseStatusPayload
}

const setDatasetReleaseStatus: ActionFunction<
  SetDatasetReleaseStatusPayload
> = (state, { datasetID, releaseStatus }) => {
  const nextDataset = {
    ...state.datasets.data[datasetID],
    releaseStatus,
  }

  return {
    ...state,
    datasets: {
      ...state.datasets,
      data: {
        ...state.datasets.data,
        [datasetID]: nextDataset,
      },
    },
    messageStack: {
      [`${APIRoutes.saveDataset}_${datasetID}_local`]: {
        route: APIRoutes.saveDataset,
        target: 'local',
        status: StorageMessageStatus.Initial,
        data: nextDataset,
      },
    },
  }
}

export default setDatasetReleaseStatus
