import { ActionFunction, DatasetsActions } from '../datasetsReducer'
import { DatasetRow, VersionStatus } from '../types'

export interface CreateVersionAction {
  type: DatasetsActions.CreateVersion
  payload: CreateVersionPayload
}

export interface CreateVersionPayload {
  datasetID: string
  raw: DatasetRow[]
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
        {
          date: new Date().toUTCString(),
          status: VersionStatus.Unsaved,
          raw: payload.raw,
        },
      ],
      // set the new version to be active
      activeVersion: state.datasets[payload.datasetID].versions?.length ?? 0,
    },
  },
})

export default createVersion
