import {
  APIRoutes,
  StorageMessageStatus,
} from 'storage/synchronizeMessageQueue'
import { ActionFunction, StateActions } from '../stateReducer'
import { DatasetReleaseStatus } from '../types'

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
> = (state, { datasetID, lastUpdated, releaseStatus }) => {
  const nextDataset = {
    ...state.datasets.data[datasetID],
    releaseStatus,
    lastUpdated,
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
      [`${APIRoutes.saveDataset}_${datasetID}_remote`]: {
        route: APIRoutes.saveDataset,
        target: 'remote',
        status: StorageMessageStatus.Initial,
        data: nextDataset,
      },
    },
  }
}

export default setDatasetReleaseStatus
