import { ActionFunction, DatasetsActions } from '../datasetsReducer'

export interface SetActiveVersionAction {
  type: DatasetsActions.SetActiveVersion
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
    [payload.datasetID]: {
      ...state.datasets[payload.datasetID],
      activeVersion: payload.version,
    },
  },
})

export default setActiveVersion
