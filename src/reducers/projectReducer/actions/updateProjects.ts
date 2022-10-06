import { ActionFunction, ProjectActions } from '../projectReducer'
import { APIRoute, NodeStatus, Project, StorageMessageStatus } from '../types'

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
  console.log('updateProjects')
  console.log(JSON.stringify(state))

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
        nextState.projects[key] = { ...nextProject }

        if (nextState.status === NodeStatus.Syncing)
          nextState.storageQueue = [
            ...nextState.storageQueue,
            {
              route: APIRoute.saveProject,
              target: payload.source === 'local' ? 'remote' : 'local',
              status: StorageMessageStatus.Initial,
              data: nextProject,
            },
          ]
      } else {
        // if it is not newer, we need to update storage
        if (nextState.status === NodeStatus.Syncing)
          nextState.storageQueue = [
            ...nextState.storageQueue,
            {
              route: APIRoute.saveProject,
              target: payload.source === 'local' ? 'local' : 'remote',
              status: StorageMessageStatus.Initial,
              data: prevProject,
            },
          ]
      }
    } else {
      // if the project is new in state, add it
      nextState.projects[key] = { ...nextProject }

      // and add to the queue to store it
      if (nextState.status === NodeStatus.Syncing)
        nextState.storageQueue = [
          ...nextState.storageQueue,
          {
            route: APIRoute.saveProject,
            target: payload.source === 'local' ? 'remote' : 'local',
            status: StorageMessageStatus.Initial,
            data: nextProject,
          },
        ]
    }
  }

  return nextState
}

export default updateProjects
