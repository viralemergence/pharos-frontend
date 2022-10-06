import { ActionFunction, ProjectActions } from '../projectReducer'
import { Project } from '../types'
import { nanoid } from 'nanoid'
import {
  APIRoutes,
  StorageMessageStatus,
} from 'storage/synchronizeMessageQueue'

export interface CreateProjectAction {
  type: ProjectActions.CreateProject
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
      [payload.projectID]: payload,
    },
    messageStack: {
      ...state.messageStack,
      [nanoid()]: {
        route: APIRoutes.saveProject,
        target: 'local',
        status: StorageMessageStatus.Initial,
        data: payload,
      },
      [nanoid()]: {
        route: APIRoutes.saveProject,
        target: 'remote',
        status: StorageMessageStatus.Initial,
        data: payload,
      },
      // [nanoid()]: {
      //   route: APIRoute.saveUser,
      //   target: 'local',
      //   status: StorageMessageStatus.Initial,
      //   data: nextUser,
      // },
      // [nanoid()]: {
      //   route: APIRoute.saveUser,
      //   target: 'remote',
      //   status: StorageMessageStatus.Initial,
      //   data: nextUser,
      // },
    },
  }
}

export default createProject
