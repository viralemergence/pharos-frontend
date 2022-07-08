import { Project, ProjectStatus } from './types'

import setActiveVersion, {
  SetActiveVersionAction,
} from './actions/setActiveVersion'
import setProject, { SetProjectAction } from './actions/setProject'
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
export enum ProjectActions {
  // datasets
  SetStatus,
  SetProject,
  CreateDataset,
  SetDatasetStatus,
  // versions
  UpdateVersion,
  CreateVersion,
  SetActiveVersion,
  SetVersionStatus,
}

export const projectInitialValue = {
  projectID: '0',
  status: ProjectStatus.Initial,
  datasets: {},
}

export type ProjectAction =
  // datsets
  | SetStatusAction
  | SetProjectAction
  | CreateDatasetAction
  | SetDatasetStatusAction
  // versions
  | UpdateVersionAction
  | CreateVersionAction
  | SetActiveVersionAction
  | SetVersionStatusAction

export type ActionFunction<T = void> = (state: Project, payload: T) => Project

const projectReducer = (state: Project, action: ProjectAction) => {
  switch (action.type) {
    // datsets
    case ProjectActions.SetStatus:
      return setStatus(state, action.payload)
    case ProjectActions.SetProject:
      return setProject(state, action.payload)
    case ProjectActions.CreateDataset:
      return createDataset(state, action.payload)
    case ProjectActions.SetDatasetStatus:
      return setDatasetStatus(state, action.payload)
    // versions
    case ProjectActions.UpdateVersion:
      return updateVersion(state, action.payload)
    case ProjectActions.CreateVersion:
      return createVersion(state, action.payload)
    case ProjectActions.SetActiveVersion:
      return setActiveVersion(state, action.payload)
    case ProjectActions.SetVersionStatus:
      return setVersionStatus(state, action.payload)
  }
}

export default projectReducer
