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
  payload
) => ({
  ...state,
  datasets: {
    ...state.datasets,
    [payload.datasetID]: {
      ...state.datasets[payload.datasetID],
      lastUpdated: payload.lastUpdated,
    },
  },
})

export default setDatasetLastUpdated
