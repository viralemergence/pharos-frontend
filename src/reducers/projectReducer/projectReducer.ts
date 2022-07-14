import { Project, ProjectStatus } from './types'

import setActiveVersion, {
  SetActiveVersionAction,
} from './actions/setActiveVersion'
import setProject, { SetProjectAction } from './actions/setProject'
import setStatus, { SetStatusAction } from './actions/setProjectStatus'
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
export enum ProjectActions {
  // datasets
  SetProject,
  SetDatasetStatus,
  // versions
  // UpdateVersion,
  // CreateVersion,
  // SetVersionStatus,

  // allows the user to select past versions
  // this one still makes sense
  SetActiveVersion,

  // create new dataset
  // this is where we set up
  // the register and prepare
  // it for records
  CreateDataset,

  // actions to implement

  // rename everything about this to be
  // setProjectStatus
  SetProjectStatus,

  // add a new project to the portfolio
  // skip for now
  // CreateProject,

  // set status of the register
  // this is called in the process
  // of handling the network
  // request to the server
  SetRegisterStatus,

  // if the datapoint doesn't exist, create it

  // if the datapoint exists, and the
  // current version is unsaved, update
  // the value in the current version

  // if the current version is saved
  // update the value as one version
  // number higher
  SetDatapoint,

  // create new version

  // called when the user
  // presses the save button

  // create the object in the
  // versions array with metadata
  CreateVersion,
}

export const projectInitialValue = {
  projectID: '0',
  status: ProjectStatus.Initial,
  datasets: {},
}

export type ProjectAction =
  // state relative to server:
  | SetStatusAction
  // datsets
  | SetProjectAction
  | CreateDatasetAction
  | SetDatasetStatusAction
  // register
  | SetRegisterStatusAction
  // versions
  | SetActiveVersionAction
// | UpdateVersionAction
// | CreateVersionAction
// | SetVersionStatusAction

export type ActionFunction<T = void> = (state: Project, payload: T) => Project

const projectReducer = (state: Project, action: ProjectAction) => {
  switch (action.type) {
    // datsets
    case ProjectActions.SetProjectStatus:
      return setStatus(state, action.payload)
    case ProjectActions.SetProject:
      return setProject(state, action.payload)
    case ProjectActions.CreateDataset:
      return createDataset(state, action.payload)
    case ProjectActions.SetDatasetStatus:
      return setDatasetStatus(state, action.payload)
    // versions
    // case ProjectActions.UpdateVersion:
    // return updateVersion(state, action.payload)
    // case ProjectActions.CreateVersion:
    // return createVersion(state, action.payload)
    // case ProjectActions.SetVersionStatus:
    //   return setVersionStatus(state, action.payload)
    case ProjectActions.SetActiveVersion:
      return setActiveVersion(state, action.payload)
    default:
      return state
  }
}

export default projectReducer
