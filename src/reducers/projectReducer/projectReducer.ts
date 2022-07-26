import { Dataset, DatasetStatus, Project, ProjectStatus } from './types'

import setActiveVersion, {
  SetActiveVersionAction,
} from './actions/setActiveVersion'
import setProject, { SetProjectAction } from './actions/setProject'
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
} from './actions/batchSetDatapoint'

// reducer actions
export enum ProjectActions {
  // datasets
  SetProject,
  SetDatasetStatus,
  // versions

  // allows the user to select past versions
  SetActiveVersion,
  SetVersions,

  // create new dataset this is where we set up
  // the register and prepare it for records
  CreateDataset,

  // set the status of the project
  // relative to the server
  SetProjectStatus,

  // add a new project to the portfolio
  // skip for now, we need to decide if
  // that is within the scope of this reducer
  // CreateProject,

  // set status of the register
  // this is called in the process of handling
  // the network request to the server
  SetRegisterStatus,

  // create new version
  // called when the user presses the save button
  CreateVersion,

  // actions to implement

  // if the datapoint doesn't exist, create it

  // if the datapoint exists, and the
  // current version is unsaved, update
  // the value in the current version

  // if the current version is saved
  // update the value as one version
  // number higher
  SetDatapoint,
  SetRegisterKey,
  ReplaceRegister,
  BatchSetDatapoint,
}

export const projectInitialValue: Project = {
  projectID: '0',
  status: ProjectStatus.Initial,
  datasets: {},
}

export const datasetInitialValue: Dataset = {
  name: 'Loading dataset',
  datasetID: '',
  researcherID: '',
  status: DatasetStatus.Loading,
  activeVersion: 0,
  versions: [],
  register: {},
}

export type ProjectAction =
  | SetProjectAction
  // state relative to server
  | SetProjectStatusAction
  // datsets
  | CreateDatasetAction
  | SetDatasetStatusAction
  // register
  | SetRegisterStatusAction
  | ReplaceRegisterAction
  // versions
  | CreateVersionAction
  | SetActiveVersionAction
  | SetVersionsAction
  // datapoint
  | SetDatapointAction
  | BatchSetDatapointAction

export type ActionFunction<T = void> = (state: Project, payload: T) => Project

const projectReducer = (state: Project, action: ProjectAction) => {
  switch (action.type) {
    // datsets
    case ProjectActions.SetProjectStatus:
      return setProjectStatus(state, action.payload)
    case ProjectActions.SetProject:
      return setProject(state, action.payload)
    case ProjectActions.CreateDataset:
      return createDataset(state, action.payload)
    case ProjectActions.SetDatasetStatus:
      return setDatasetStatus(state, action.payload)
    case ProjectActions.CreateVersion:
      return createVersion(state, action.payload)
    case ProjectActions.SetVersions:
      return setVersions(state, action.payload)
    case ProjectActions.SetRegisterStatus:
      return setRegisterStatus(state, action.payload)
    case ProjectActions.ReplaceRegister:
      return replaceRegister(state, action.payload)
    case ProjectActions.SetActiveVersion:
      return setActiveVersion(state, action.payload)
    case ProjectActions.SetDatapoint:
      return setDatapoint(state, action.payload)
    case ProjectActions.BatchSetDatapoint:
      return batchSetDatapoint(state, action.payload)
    default:
      return state
  }
}

export default projectReducer
