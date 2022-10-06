import { ActionFunction, ProjectActions } from '../projectReducer'
import { APIRoute, Project, StorageMessageStatus } from '../types'

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
    messageStack: [
      ...state.messageStack,
      {
        route: APIRoute.saveProject,
        target: 'local',
        status: StorageMessageStatus.Initial,
        data: payload,
      },
      {
        route: APIRoute.saveProject,
        target: 'remote',
        status: StorageMessageStatus.Initial,
        data: payload,
      },
    ],
  }
}

export default createProject
