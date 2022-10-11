import { ActionFunction, StateActions } from '../projectReducer'
import { DatasetStatus } from '../types'

export interface SetDatasetStatusPayload {
  datasetID: string
  status: DatasetStatus
}

export interface SetDatasetStatusAction {
  type: StateActions.SetDatasetStatus
  payload: SetDatasetStatusPayload
}

const setDatasetStatus: ActionFunction<SetDatasetStatusPayload> = (
  state,
  payload
) => ({
  ...state,
  datasets: {
    ...state.datasets,
    [payload.datasetID]: {
      ...state.datasets[payload.datasetID],
      status: payload.status,
    },
  },
})

export default setDatasetStatus
