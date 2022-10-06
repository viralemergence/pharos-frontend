import { ActionFunction, ProjectActions } from '../projectReducer'
import { APIRoute, Project, StorageMessageStatus } from '../types'
import { nanoid } from 'nanoid'

export interface CreateProjectAction {
  type: ProjectActions.CreateProject
  payload: Project
}

const createProject: ActionFunction<Project> = (state, payload) => {
  return {
    ...state,
    projects: {
      ...state.projects,
      [payload.projectID]: payload,
    },
    messageStack: {
      ...state.messageStack,
      [nanoid()]: {
        route: APIRoute.saveProject,
        target: 'local',
        status: StorageMessageStatus.Initial,
        data: payload,
      },
      [nanoid()]: {
        route: APIRoute.saveProject,
        target: 'remote',
        status: StorageMessageStatus.Initial,
        data: payload,
      },
    },
  }
}

export default createProject
