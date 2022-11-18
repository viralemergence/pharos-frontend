import {
  APIRoutes,
  StorageMessageStatus,
} from 'storage/synchronizeMessageQueue'
import { ActionFunction, StateActions } from '../stateReducer'
import { Project, ProjectStatus, Dataset, DatasetReleaseStatus } from '../types'

interface CreateDatasetPayload {
  timestamp: string
  projectID: string
  dataset: Dataset
}

export interface CreateDatasetAction {
  type: StateActions.CreateDataset
  payload: CreateDatasetPayload
}

const createDataset: ActionFunction<CreateDatasetPayload> = (
  state,
  payload
) => {
  const nextProject: Project = {
    ...state.projects.data[payload.projectID],
    lastUpdated: payload.timestamp,
    status: ProjectStatus.Unsaved,
    datasetIDs: [
      ...state.projects.data[payload.projectID].datasetIDs,
      payload.dataset.datasetID,
    ],
  }

  return {
    ...state,
    projects: {
      ...state.projects,
      data: {
        ...state.projects.data,
        [payload.projectID]: nextProject,
      },
    },
    datasets: {
      ...state.datasets,
      data: {
        ...state.datasets.data,
        [payload.dataset.datasetID]: {
          ...payload.dataset,
          lastUpdated: payload.timestamp,
          releaseStatus: DatasetReleaseStatus.Unreleased,
        },
      },
    },
    messageStack: {
      ...state.messageStack,
      [`${APIRoutes.saveDataset}_${payload.dataset.datasetID}_local`]: {
        route: APIRoutes.saveDataset,
        target: 'local',
        status: StorageMessageStatus.Initial,
        data: payload.dataset,
      },
      [`${APIRoutes.saveDataset}_${payload.dataset.datasetID}_remote`]: {
        route: APIRoutes.saveDataset,
        target: 'remote',
        status: StorageMessageStatus.Initial,
        data: payload.dataset,
      },
      [`${APIRoutes.saveProject}_${payload.projectID}_local`]: {
        route: APIRoutes.saveProject,
        target: 'local',
        status: StorageMessageStatus.Initial,
        data: nextProject,
      },
      [`${APIRoutes.saveProject}_${payload.projectID}_remote`]: {
        route: APIRoutes.saveProject,
        target: 'remote',
        status: StorageMessageStatus.Initial,
        data: nextProject,
      },
    },
  }
}

export default createDataset
