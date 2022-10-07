import { ActionFunction, ProjectActions } from '../projectReducer'
import { Project } from '../types'
import {
  APIRoutes,
  StorageMessageStatus,
} from 'storage/synchronizeMessageQueue'

interface SetProjectsActionPayload {
  source: 'local' | 'remote'
  projects: { [key: string]: Project }
}

export interface UpdateProjectsAction {
  type: ProjectActions.UpdateProjects
  payload: SetProjectsActionPayload
}

const updateProjects: ActionFunction<SetProjectsActionPayload> = (
  state,
  payload
) => {
  const nextState = { ...state }

  for (const [key, nextProject] of Object.entries(payload.projects)) {
    const prevProject = state.projects[key]

    // if the project already exists in state
    if (state.projects[key]) {
      const prevDate = new Date(prevProject.lastUpdated ?? 0)
      const nextDate = new Date(nextProject.lastUpdated ?? 0)

      // short-circuit if it's identical
      if (prevDate.getTime() === nextDate.getTime()) continue

      // if the incoming project is newer than the one in state
      if (prevDate.getTime() < nextDate.getTime()) {
        nextState.projects = { ...nextState.projects, [key]: nextProject }

        // if the newer incomeing project
        // is from the remote save it to local
        if (payload.source === 'remote')
          nextState.messageStack = {
            ...nextState.messageStack,
            [`${APIRoutes.saveProject}_${nextProject.projectID}_local`]: {
              route: APIRoutes.saveProject,
              target: 'local',
              status: StorageMessageStatus.Initial,
              data: nextProject,
            },
          }
      }
    } else {
      // if the project is new in state, add it
      nextState.projects = { ...nextState.projects, [key]: nextProject }

      // and add to the queue to store it
      if (payload.source === 'remote') {
        nextState.messageStack = {
          ...nextState.messageStack,
          [`${APIRoutes.saveProject}_${nextProject.projectID}_local`]: {
            route: APIRoutes.saveProject,
            target: 'local',
            status: StorageMessageStatus.Initial,
            data: nextProject,
          },
        }
      }
    }
  }

  return nextState
}

export default updateProjects
