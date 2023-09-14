import { AppState } from './types'

import updateProjects, { UpdateProjectsAction } from './actions/updateProjects'
import createDataset, { CreateDatasetAction } from './actions/createDataset'
import setDatapoint, { SetDatapointAction } from './actions/setDatapoint'
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
import setUserStatus, { SetUserStatusAction } from './actions/setUserStatus'
import extendRegister, { ExtendRegisterAction } from './actions/extendRegister'
import setProjectPublishingStatus, {
  SetProjectPublishingStatusAction,
} from './actions/setProjectPublishing'
import editProject, { EditProjectAction } from './actions/editProject'

// reducer actions
export enum StateActions {
  // user actions
  UpdateUser,
  SetUserStatus,

  // general state
  SetMetadataObjStatus,

  // storage messages
  SetMessageStack,
  SetStorageMessageStatus,
  RemoveStorageMessage,

  // project actions
  UpdateProjects,
  CreateProject,
  EditProject,
  SetProjectPublishingStatus,

  // dataset actions
  CreateDataset,
  UpdateDatasets,
  SetDatasetReleaseStatus,

  // register actions
  UpdateRegister,
  ExtendRegister,
  SetDatapoint,
}

export type StateAction =
  // user actions
  | UpdateUserAction
  | SetUserStatusAction

  // general state
  | SetMetadataObjStatus

  // storage messages
  | SetMessageStackAction
  | SetStorageMessageStatusAction
  | RemoveStorageMessageAction

  // project actions
  | UpdateProjectsAction
  | CreateProjectAction
  | EditProjectAction
  | SetProjectPublishingStatusAction

  // dataset actions
  | CreateDatasetAction
  | UpdateDatasetsAction
  | SetDatasetReleaseStatusAction

  // register actions
  | UpdateRegisterAction
  | ExtendRegisterAction
  | SetDatapointAction

export type ActionFunction<T = void> = (state: AppState, payload: T) => AppState

// // debugging wrapper on stateReducer
// const stateReducer = (state: AppState, action: ProjectAction) => {
//   console.log('STATE ' + JSON.stringify(state))
//   console.log('ACTION ' + JSON.stringify(action))
//   const nextState = _projectReducer(state, action)
//   console.log('NEXT ' + JSON.stringify(nextState))
//   return nextState
// }

const stateReducer = (state: AppState, action: StateAction) => {
  switch (action.type) {
    case StateActions.UpdateUser:
      return updateUser(state, action.payload)
    case StateActions.SetUserStatus:
      return setUserStatus(state, action.payload)

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
    case StateActions.UpdateProjects:
      return updateProjects(state, action.payload)
    case StateActions.CreateProject:
      return createProject(state, action.payload)
    case StateActions.EditProject:
      return editProject(state, action.payload)
    case StateActions.SetProjectPublishingStatus:
      return setProjectPublishingStatus(state, action.payload)

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
    case StateActions.ExtendRegister:
      return extendRegister(state, action.payload)
    case StateActions.SetDatapoint:
      return setDatapoint(state, action.payload)

    default:
      return state
  }
}

export default stateReducer
