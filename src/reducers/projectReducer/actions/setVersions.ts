import { ActionFunction, StateActions } from '../projectReducer'
import { Version } from '../types'

export interface SetVersionsPayload {
  datasetID: string
  versions: Version[]
}

export interface SetVersionsAction {
  type: StateActions.SetVersions
  payload: SetVersionsPayload
}

const setVersions: ActionFunction<SetVersionsPayload> = (state, payload) => ({
  ...state,
  datasets: {
    ...state.datasets,
    [payload.datasetID]: {
      ...state.datasets[payload.datasetID],
      versions: payload.versions,
      activeVersion: payload.versions.length - 1,
    },
  },
})

export default setVersions
