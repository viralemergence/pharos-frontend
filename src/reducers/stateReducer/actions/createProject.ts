import { ActionFunction, StateActions } from '../stateReducer'
import { Project } from '../types'
import {
  APIRoutes,
  StorageMessageStatus,
} from 'storage/synchronizeMessageQueue'

export interface CreateProjectAction {
  type: StateActions.CreateProject
  payload: Project
}

const createProject: ActionFunction<Project> = (state, payload) => {
  const nextUser = {
    ...state.user,
    data: {
      ...state.user.data!,
      projectIDs: [...(state.user.data?.projectIDs ?? []), payload.projectID],
    },
  }

  return {
    ...state,
    user: nextUser,
    projects: {
      ...state.projects,
      data: {
        ...state.projects.data,
        [payload.projectID]: payload,
      },
    },
    messageStack: {
      ...state.messageStack,
      [`${APIRoutes.saveUser}_user_local`]: {
        route: APIRoutes.saveUser,
        target: 'local',
        status: StorageMessageStatus.Initial,
        data: nextUser,
      },
      [`${APIRoutes.saveUser}_user_remote`]: {
        route: APIRoutes.saveUser,
        target: 'remote',
        status: StorageMessageStatus.Initial,
        data: nextUser,
      },
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

export default createProject
