import {
  AppState,
  Dataset,
  DatasetStatus,
  Project,
  ProjectPublishStatus,
  ProjectStatus,
  NodeStatus,
  MessageStackStatus,
} from './types'

import setActiveVersion, {
  SetActiveVersionAction,
} from './actions/setActiveVersion'
// import setProject, { SetProjectAction } from './actions/setProject'
import updateProjects, { UpdateProjectsAction } from './actions/updateProjects'
import setProjectStatus, {
  SetProjectStatusAction,
} from './actions/setProjectStatus'
import createDataset, { CreateDatasetAction } from './actions/createDataset'
import setDatasetStatus, {
  SetDatasetStatusAction,
} from './actions/setDatasetStatus'
import createVersion, { CreateVersionAction } from './actions/createVersion'
import setRegisterStatus, {
  SetRegisterStatusAction,
} from './actions/setRegisterStatus'
import setDatapoint, { SetDatapointAction } from './actions/setDatapoint'
import replaceRegister, {
  ReplaceRegisterAction,
} from './actions/replaceRegister'
import setVersions, { SetVersionsAction } from './actions/setVersions'
import batchSetDatapoint, {
  BatchSetDatapointAction,
} from './actions/mutationBatchSetDatapoint'
import setDatasetLastUpdated, {
  SetDatasetLastUpdatedAction,
} from './actions/setDatasetLastUpdated'
import setDatasetReleaseStatus, {
  SetDatasetReleaseStatusAction,
} from './actions/setDatasetReleaseStatus'
import setAppStateStatus, {
  SetAppStateStatusAction,
} from './actions/setAppStateStatus'
import createProject, { CreateProjectAction } from './actions/createProject'
import setStorageMessageStatus, {
  SetStorageMessageStatusAction,
} from './actions/setStorageMessageStatus'
import removeStorageMessage, {
  RemoveStorageMessageAction,
} from './actions/removeStorageMessage'
import { defaultUserState } from 'components/Login/UserContextProvider'
import setUser, { SetUserAction } from './actions/setUser'
import setMessageStackStatus, {
  SetMessageStackStatusAction,
} from './actions/setMessageStackStatus'
import setMessageStack, {
  SetMessageStackAction,
} from './actions/setMessageStack'
import updateDatasets, { UpdateDatasetsAction } from './actions/updateDatasets'

// reducer actions
export enum ProjectActions {
  // SetProject,
  SetUser,
  SetAppStateStatus,

  UpdateProjects,
  CreateProject,

  SetMessageStack,
  SetMessageStackStatus,
  SetStorageMessageStatus,
  RemoveStorageMessage,

  CreateDataset,
  UpdateDatasets,

  // SetDatasetStatus,
  // SetDatasetReleaseStatus,
  // SetDatasetLastUpdated,

  // SetActiveVersion,
  // SetVersions,

  // SetProjectStatus,

  // SetRegisterStatus,

  // CreateVersion,

  // SetDatapoint,
  // SetRegisterKey,
  // ReplaceRegister,
  // BatchSetDatapoint,
}

export const projectInitialValue: Project = {
  name: '',
  projectID: '0',
  datasetIDs: [],
  status: ProjectStatus.Initial,
  publishStatus: ProjectPublishStatus.Unpublished,
}

export const datasetInitialValue: Dataset = {
  name: 'Loading dataset',
  datasetID: '',
  researcherID: '',
  status: DatasetStatus.Loading,
  activeVersion: 0,
  highestVersion: 0,
  versions: [],
  register: {},
}

export const stateInitialValue: AppState = {
  user: defaultUserState,
  projects: {
    status: NodeStatus.Drifted,
    data: {},
  },
  datasets: {
    status: NodeStatus.Drifted,
    data: {},
  },
  messageStack: {},
  messageStackStatus: MessageStackStatus.Ready,
}

export type ProjectAction =
  // | SetProjectAction
  | SetUserAction
  | SetAppStateStatusAction
  | UpdateProjectsAction
  | CreateProjectAction
  | SetMessageStackAction
  | SetMessageStackStatusAction
  | SetStorageMessageStatusAction
  | RemoveStorageMessageAction
  // state relative to server
  // | SetProjectStatusAction
  // // datsets
  | CreateDatasetAction
  | UpdateDatasetsAction
// | SetDatasetStatusAction
// | SetDatasetReleaseStatusAction
// | SetDatasetLastUpdatedAction
// // register
// | SetRegisterStatusAction
// | ReplaceRegisterAction
// // versions
// | CreateVersionAction
// | SetActiveVersionAction
// | SetVersionsAction
// // datapoint
// | SetDatapointAction
// | BatchSetDatapointAction

export type ActionFunction<T = void> = (state: AppState, payload: T) => AppState

// const projectReducer = (state: AppState, action: ProjectAction) => {
//   console.log('STATE ' + JSON.stringify(state))
//   console.log('ACTION ' + JSON.stringify(action))
//   const nextState = _projectReducer(state, action)
//   console.log('NEXT ' + JSON.stringify(nextState))
//   return nextState
// }

const projectReducer = (state: AppState, action: ProjectAction) => {
  switch (action.type) {
    // datsets
    // case ProjectActions.SetProjectStatus:
    //   return setProjectStatus(state, action.payload)
    // case ProjectActions.SetProject:
    //   return setProject(state, action.payload)

    case ProjectActions.SetUser:
      return setUser(state, action.payload)

    case ProjectActions.SetAppStateStatus:
      return setAppStateStatus(state, action.payload)

    // storage message actions
    case ProjectActions.SetMessageStack:
      return setMessageStack(state, action.payload)
    case ProjectActions.SetMessageStackStatus:
      return setMessageStackStatus(state, action.payload)
    case ProjectActions.SetStorageMessageStatus:
      return setStorageMessageStatus(state, action.payload)
    case ProjectActions.RemoveStorageMessage:
      return removeStorageMessage(state, action.payload)

    // project actions
    case ProjectActions.CreateProject:
      return createProject(state, action.payload)
    case ProjectActions.UpdateProjects:
      return updateProjects(state, action.payload)

    // dataset actions
    case ProjectActions.UpdateDatasets:
      return updateDatasets(state, action.payload)
    case ProjectActions.CreateDataset:
      return createDataset(state, action.payload)

    // case ProjectActions.SetDatasetStatus:
    //   return setDatasetStatus(state, action.payload)
    // case ProjectActions.SetDatasetReleaseStatus:
    //   return setDatasetReleaseStatus(state, action.payload)
    // case ProjectActions.SetDatasetLastUpdated:
    //   return setDatasetLastUpdated(state, action.payload)
    // case ProjectActions.CreateVersion:
    //   return createVersion(state, action.payload)
    // case ProjectActions.SetVersions:
    //   return setVersions(state, action.payload)
    // case ProjectActions.SetRegisterStatus:
    //   return setRegisterStatus(state, action.payload)
    // case ProjectActions.ReplaceRegister:
    //   return replaceRegister(state, action.payload)
    // case ProjectActions.SetActiveVersion:
    //   return setActiveVersion(state, action.payload)
    // case ProjectActions.SetDatapoint:
    //   return setDatapoint(state, action.payload)
    // case ProjectActions.BatchSetDatapoint:
    //   return batchSetDatapoint(state, action.payload)
    default:
      return state
  }
}

export default projectReducer
