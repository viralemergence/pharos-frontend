import {
  APIRoutes,
  StorageMessageStatus,
} from 'storage/synchronizeMessageQueue'
import { ActionFunction, StateActions } from '../stateReducer'
import { NodeStatus, Project, Dataset } from '../types'

interface DeleteDatasetPayload {
  timestamp: string
  projectID: string
  dataset: Dataset
}

export interface DeleteDatasetAction {
  type: StateActions.DeleteDataset
  payload: DeleteDatasetPayload
}

const deleteDataset: ActionFunction<DeleteDatasetPayload> = (
  state,
  payload
) => {
  const nextProject: Project = {
    ...state.projects.data[payload.projectID],
    lastUpdated: payload.timestamp,
    datasetIDs: state.projects.data[payload.projectID].datasetIDs.filter(
      id => id !== payload.dataset.datasetID
    ),
    deletedDatasetIDs: [
      ...(state.projects.data[payload.projectID].deletedDatasetIDs ?? []),
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
      status: NodeStatus.Initial,
      data: {},
    },

    messageStack: {
      ...state.messageStack,
      [`${APIRoutes.deleteDataset}_${payload.dataset.datasetID}_local`]: {
        route: APIRoutes.deleteDataset,
        target: 'local',
        status: StorageMessageStatus.Initial,
        data: payload.dataset,
      },
      [`${APIRoutes.deleteDataset}_${payload.dataset.datasetID}_remote`]: {
        route: APIRoutes.deleteDataset,
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

export default deleteDataset
