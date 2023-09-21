import { ActionFunction, StateActions } from '../stateReducer'
import { Dataset, Project } from '../types'
import {
  APIRoutes,
  StorageMessageStatus,
} from 'storage/synchronizeMessageQueue'

interface EditDatasetPayload {
  timestamp: string
  dataset: Dataset
}

export interface EditDatasetAction {
  type: StateActions.EditDataset
  payload: EditDatasetPayload
}

const editDataset: ActionFunction<EditDatasetPayload> = (state, payload) => {
  const nextProject: Project = {
    ...state.projects.data[payload.dataset.projectID],
    lastUpdated: payload.timestamp,
  }

  const nextDataset = {
    ...state.datasets.data[payload.dataset.datasetID],
    ...payload.dataset,
    lastUpdated: payload.timestamp,
  }

  return {
    ...state,
    projects: {
      ...state.projects,
      data: {
        ...state.projects.data,
        [payload.dataset.projectID]: nextProject,
      },
    },
    datasets: {
      ...state.datasets,
      data: {
        ...state.datasets.data,
        [payload.dataset.datasetID]: nextDataset,
      },
    },
    messageStack: {
      ...state.messageStack,
      [`${APIRoutes.saveDataset}_${payload.dataset.datasetID}_remote`]: {
        route: APIRoutes.saveDataset,
        target: 'remote',
        status: StorageMessageStatus.Initial,
        data: nextDataset,
      },
      [`${APIRoutes.saveDataset}_${payload.dataset.datasetID}_local`]: {
        route: APIRoutes.saveDataset,
        target: 'local',
        status: StorageMessageStatus.Initial,
        data: nextDataset,
      },
      [`${APIRoutes.saveProject}_${payload.dataset.projectID}_local`]: {
        route: APIRoutes.saveProject,
        target: 'local',
        status: StorageMessageStatus.Initial,
        data: nextProject,
      },
      [`${APIRoutes.saveProject}_${payload.dataset.projectID}_remote`]: {
        route: APIRoutes.saveProject,
        target: 'remote',
        status: StorageMessageStatus.Initial,
        data: nextProject,
      },
    },
  }
}

export default editDataset
