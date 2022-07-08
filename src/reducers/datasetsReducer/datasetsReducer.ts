import { Datasets, DatasetsStatus } from './types'

import setActiveVersion, {
  SetActiveVersionAction,
} from './actions/setActiveVersion'
import setDatasets, { SetDatasetsAction } from './actions/setDatasets'
import setStatus, { SetStatusAction } from './actions/setStatus'
import createDataset, { CreateDatasetAction } from './actions/createDataset'
import setDatasetStatus, {
  SetDatasetStatusAction,
} from './actions/setDatasetStatus'
import createVersion, { CreateVersionAction } from './actions/createVersion'
import setVersionStatus, {
  SetVersionStatusAction,
} from './actions/setVersionStatus'
import updateVersion, { UpdateVersionAction } from './actions/updateVersion'

// reducer actions
export enum DatasetsActions {
  // datasets
  SetStatus,
  SetDatasets,
  CreateDataset,
  SetDatasetStatus,
  // versions
  UpdateVersion,
  CreateVersion,
  SetActiveVersion,
  SetVersionStatus,
}

export const datasetsInitialValue = {
  datasets: {},
  status: DatasetsStatus.Initial,
}

export type DatasetsAction =
  // datsets
  | SetStatusAction
  | SetDatasetsAction
  | CreateDatasetAction
  | SetDatasetStatusAction
  // versions
  | UpdateVersionAction
  | CreateVersionAction
  | SetActiveVersionAction
  | SetVersionStatusAction

export type ActionFunction<T = void> = (state: Datasets, payload: T) => Datasets

const datasetsReducer = (state: Datasets, action: DatasetsAction) => {
  switch (action.type) {
    // datsets
    case DatasetsActions.SetStatus:
      return setStatus(state, action.payload)
    case DatasetsActions.SetDatasets:
      return setDatasets(state, action.payload)
    case DatasetsActions.CreateDataset:
      return createDataset(state, action.payload)
    case DatasetsActions.SetDatasetStatus:
      return setDatasetStatus(state, action.payload)
    // versions
    case DatasetsActions.UpdateVersion:
      return updateVersion(state, action.payload)
    case DatasetsActions.CreateVersion:
      return createVersion(state, action.payload)
    case DatasetsActions.SetActiveVersion:
      return setActiveVersion(state, action.payload)
    case DatasetsActions.SetVersionStatus:
      return setVersionStatus(state, action.payload)
  }
}

export default datasetsReducer
