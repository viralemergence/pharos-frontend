import {
  APIRoutes,
  StorageMessageStatus,
} from 'storage/synchronizeMessageQueue'
import { ActionFunction, StateActions } from '../stateReducer'

export interface SetDatasetLastUpdatedPayload {
  datasetID: string
  lastUpdated: string
}

export interface SetDatasetLastUpdatedAction {
  type: StateActions.SetDatasetLastUpdated
  payload: SetDatasetLastUpdatedPayload
}

const setDatasetLastUpdated: ActionFunction<SetDatasetLastUpdatedPayload> = (
  state,
  { datasetID, lastUpdated }
) => {
  const nextDataset = {
    ...state.datasets.data[datasetID],
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

export default setDatasetLastUpdated
