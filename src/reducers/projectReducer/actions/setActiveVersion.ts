import { ActionFunction, StateActions } from '../projectReducer'

export interface SetActiveVersionAction {
  type: StateActions.SetActiveVersion
  payload: SetActiveVersionPayload
}

export interface SetActiveVersionPayload {
  datasetID: string
  version: number
}

const setActiveVersion: ActionFunction<SetActiveVersionPayload> = (
  state,
  payload
) => ({
  ...state,
  datasets: {
    ...state.datasets,
    [payload.datasetID]: {
      ...state.datasets[payload.datasetID],
      activeVersion: payload.version,
    },
  },
})

export default setActiveVersion
