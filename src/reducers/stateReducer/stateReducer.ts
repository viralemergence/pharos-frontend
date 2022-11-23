import { AppState } from './types'

import setActiveVersion, {
  SetActiveVersionAction,
} from './actions/setActiveVersion'
import createVersion, { CreateVersionAction } from './actions/createVersion'
import setVersions, { SetVersionsAction } from './actions/setVersions'

import updateProjects, { UpdateProjectsAction } from './actions/updateProjects'
import createDataset, { CreateDatasetAction } from './actions/createDataset'
import setDatapoint, { SetDatapointAction } from './actions/setDatapoint'
import batchSetDatapoint, {
  BatchSetDatapointAction,
} from './actions/mutationBatchSetDatapoint'
import setDatasetLastUpdated, {
  SetDatasetLastUpdatedAction,
} from './actions/setDatasetLastUpdated'
import setDatasetReleaseStatus, {
  SetDatasetReleaseStatusAction,
} from './actions/setDatasetReleaseStatus'
import setMetadataObjStatus, {
  SetMetadataObjStatus,
} from './actions/setAppStateStatus'
import createProject, { CreateProjectAction } from './actions/createProject'
import setStorageMessageStatus, {
  SetStorageMessageStatusAction,
} from './actions/setStorageMessageStatus'
import removeStorageMessage, {
  RemoveStorageMessageAction,
} from './actions/removeStorageMessage'
import updateUser, { UpdateUserAction } from './actions/updateUser'
import setMessageStack, {
  SetMessageStackAction,
} from './actions/setMessageStack'
import updateDatasets, { UpdateDatasetsAction } from './actions/updateDatasets'
import updateRegister, { UpdateRegisterAction } from './actions/updateRegister'

// reducer actions
export enum StateActions {
  // SetProject,
  UpdateUser,
  SetMetadataObjStatus,

  UpdateProjects,
  CreateProject,

  SetMessageStack,
  SetStorageMessageStatus,
  RemoveStorageMessage,

  CreateDataset,
  UpdateDatasets,
  SetDatasetLastUpdated,
  SetDatasetReleaseStatus,

  UpdateRegister,

  // SetDatasetStatus,

  // SetActiveVersion,
  // SetVersions,

  // SetProjectStatus,

  // CreateVersion,

  SetDatapoint,
  // SetRegisterKey,
  // ReplaceRegister,
  // BatchSetDatapoint,
}

export type StateAction =
  // | SetProjectAction
  | UpdateUserAction
  | SetMetadataObjStatus
  | UpdateProjectsAction
  | CreateProjectAction
  | SetMessageStackAction
  | SetStorageMessageStatusAction
  | RemoveStorageMessageAction
  // state relative to server
  // | SetProjectStatusAction
  // // datsets
  | CreateDatasetAction
  | UpdateDatasetsAction
  | SetDatasetLastUpdatedAction
  | SetDatasetReleaseStatusAction
  | UpdateRegisterAction
  // | SetDatasetStatusAction
  // // register
  // | ReplaceRegisterAction
  // // versions
  // | CreateVersionAction
  // | SetActiveVersionAction
  // | SetVersionsAction
  // // datapoint
  | SetDatapointAction
// | BatchSetDatapointAction

export type ActionFunction<T = void> = (state: AppState, payload: T) => AppState

// const projectReducer = (state: AppState, action: ProjectAction) => {
//   console.log('STATE ' + JSON.stringify(state))
//   console.log('ACTION ' + JSON.stringify(action))
//   const nextState = _projectReducer(state, action)
//   console.log('NEXT ' + JSON.stringify(nextState))
//   return nextState
// }

const stateReducer = (state: AppState, action: StateAction) => {
  switch (action.type) {
    // datsets
    // case ProjectActions.SetProjectStatus:
    //   return setProjectStatus(state, action.payload)
    // case ProjectActions.SetProject:
    //   return setProject(state, action.payload)

    case StateActions.UpdateUser:
      return updateUser(state, action.payload)

    // set status of one of the main state objects:
    // projects, datasets, or register.
    case StateActions.SetMetadataObjStatus:
      return setMetadataObjStatus(state, action.payload)

    // storage message actions
    case StateActions.SetMessageStack:
      return setMessageStack(state, action.payload)
    case StateActions.SetStorageMessageStatus:
      return setStorageMessageStatus(state, action.payload)
    case StateActions.RemoveStorageMessage:
      return removeStorageMessage(state, action.payload)

    // project actions
    case StateActions.CreateProject:
      return createProject(state, action.payload)
    case StateActions.UpdateProjects:
      return updateProjects(state, action.payload)

    // dataset actions
    case StateActions.UpdateDatasets:
      return updateDatasets(state, action.payload)
    case StateActions.CreateDataset:
      return createDataset(state, action.payload)
    case StateActions.SetDatasetReleaseStatus:
      return setDatasetReleaseStatus(state, action.payload)

    // register actions
    case StateActions.UpdateRegister:
      return updateRegister(state, action.payload)

    // datapoint
    case StateActions.SetDatapoint:
      return setDatapoint(state, action.payload)

    // case ProjectActions.SetDatasetStatus:
    //   return setDatasetStatus(state, action.payload)
    case StateActions.SetDatasetLastUpdated:
      return setDatasetLastUpdated(state, action.payload)
    // case ProjectActions.CreateVersion:
    //   return createVersion(state, action.payload)
    // case ProjectActions.SetVersions:
    //   return setVersions(state, action.payload)
    // case ProjectActions.ReplaceRegister:
    //   return replaceRegister(state, action.payload)
    // case ProjectActions.SetActiveVersion:
    //   return setActiveVersion(state, action.payload)
    // case ProjectActions.BatchSetDatapoint:
    //   return batchSetDatapoint(state, action.payload)
    default:
      return state
  }
}

export default stateReducer
