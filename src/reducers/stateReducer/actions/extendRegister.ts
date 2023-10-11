import {
  APIRoutes,
  StorageMessageStatus,
} from 'storage/synchronizeMessageQueue'
import { ActionFunction, StateActions } from '../stateReducer'
import { DatasetID, ProjectID, Register } from '../types'

export interface ExtendRegisterPayload {
  projectID: ProjectID
  datasetID: DatasetID
  lastUpdated: string
  newRecords: Register
}

export interface ExtendRegisterAction {
  type: StateActions.ExtendRegister
  payload: ExtendRegisterPayload
}

const extendRegister: ActionFunction<ExtendRegisterPayload> = (
  state,
  { projectID, datasetID, lastUpdated, newRecords }
) => {
  // update lastUpdated
  const nextProject = {
    ...state.projects.data[projectID],
    lastUpdated,
  }

  // update lastUpdated
  const nextDataset = {
    ...state.datasets.data[datasetID],
    lastUpdated,
  }

  const nextRegister = { ...state.register.data, ...newRecords }

  return {
    ...state,
    projects: {
      ...state.projects,
      data: {
        ...state.projects.data,
        [projectID]: nextProject,
      },
    },
    register: {
      ...state.register,
      data: nextRegister,
    },
    messageStack: {
      ...state.messageStack,
      [`${APIRoutes.saveProject}_${projectID}_local`]: {
        route: APIRoutes.saveProject,
        target: 'local',
        status: StorageMessageStatus.Initial,
        data: nextProject,
      },
      [`${APIRoutes.saveProject}_${projectID}_remote`]: {
        route: APIRoutes.saveProject,
        target: 'remote',
        status: StorageMessageStatus.Initial,
        data: nextProject,
      },
      [`${APIRoutes.saveDataset}_${datasetID}_local`]: {
        route: APIRoutes.saveDataset,
        target: 'local',
        status: StorageMessageStatus.Initial,
        data: nextDataset,
      },
      [`${APIRoutes.saveDataset}_${datasetID}_remote`]: {
        route: APIRoutes.saveDataset,
        target: 'remote',
        status: StorageMessageStatus.Initial,
        data: nextDataset,
      },
      [`${APIRoutes.saveRegister}_${datasetID}_local`]: {
        route: APIRoutes.saveRegister,
        target: 'local',
        status: StorageMessageStatus.Initial,
        data: { register: nextRegister, datasetID },
      },
      [`${APIRoutes.saveRegister}_${datasetID}_remote`]: {
        route: APIRoutes.saveRegister,
        target: 'remote',
        status: StorageMessageStatus.Initial,
        data: { register: nextRegister, datasetID, projectID },
      },
    },
  }
}

export default extendRegister
