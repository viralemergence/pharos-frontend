import { ActionFunction, ProjectActions } from '../projectReducer'
import { Version } from '../types'

export interface CreateVersionPayload {
  datasetID: string
  version: Version
}

export interface CreateVersionAction {
  type: ProjectActions.CreateVersion
  payload: CreateVersionPayload
}

const createVersion: ActionFunction<CreateVersionPayload> = (
  state,
  payload
) => ({
  ...state,
  datasets: {
    ...state.datasets,
    [payload.datasetID]: {
      ...state.datasets[payload.datasetID],
      versions: [
        ...(state.datasets[payload.datasetID].versions ?? []),
        // add new version
        { ...payload.version },
      ],
      // set the new version to be active
      activeVersion: state.datasets[payload.datasetID].versions?.length ?? 0,
    },
  },
})

export default createVersion
