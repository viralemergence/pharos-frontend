import { ActionFunction, StateActions } from '../stateReducer'
import { Project } from '../types'
import {
  APIRoutes,
  StorageMessageStatus,
} from 'storage/synchronizeMessageQueue'

export interface EditProjectAction {
  type: StateActions.EditProject
  payload: Project
}

const editProject: ActionFunction<Project> = (state, payload) => {
  return {
    ...state,
    projects: {
      ...state.projects,
      data: {
        ...state.projects.data,
        [payload.projectID]: payload,
      },
    },
    messageStack: {
      ...state.messageStack,
      [`${APIRoutes.saveProject}_${payload.projectID}_remote`]: {
        route: APIRoutes.saveProject,
        target: 'remote',
        status: StorageMessageStatus.Initial,
        data: payload,
      },
      [`${APIRoutes.saveProject}_${payload.projectID}_local`]: {
        route: APIRoutes.saveProject,
        target: 'local',
        status: StorageMessageStatus.Initial,
        data: payload,
      },
    },
  }
}

export default editProject
