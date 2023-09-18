import { ActionFunction, StateActions } from '../stateReducer'
import { Project } from '../types'
import {
  APIRoutes,
  StorageMessageStatus,
} from 'storage/synchronizeMessageQueue'
import { datasetInitialValue } from '../initialValues'

interface SetProjectsActionPayload {
  source: 'local' | 'remote'
  projects: { [key: string]: Project }
}

export interface UpdateProjectsAction {
  type: StateActions.UpdateProjects
  payload: SetProjectsActionPayload
}

const updateProjects: ActionFunction<SetProjectsActionPayload> = (
  state,
  payload
) => {
  const nextState = { ...state }

  const nextMessageStack: typeof state.messageStack = {}

  for (const [key, nextProject] of Object.entries(payload.projects)) {
    const prevProject = state.projects.data[key]

    // if the project already exists in state
    if (prevProject) {
      // get the union of all datasets in both prev and next

      const nextDeletedDatasetIDSet = new Set(
        (nextProject.deletedDatasetIDs ?? []).concat(
          prevProject.deletedDatasetIDs ?? []
        )
      )

      const nextDatasetIDs = [
        ...new Set(
          nextProject.datasetIDs
            .concat(prevProject.datasetIDs)
            .filter(id => !nextDeletedDatasetIDSet.has(id))
        ),
      ]

      const nextDeletedDatasetIDs = [...nextDeletedDatasetIDSet]

      for (const datasetID of nextDeletedDatasetIDs) {
        // make sure all newly deleted datasets are deleted from indexedDB
        if (!prevProject.deletedDatasetIDs?.includes(datasetID)) {
          nextMessageStack[`${APIRoutes.deleteDataset}_${datasetID}_local`] = {
            route: APIRoutes.deleteDataset,
            target: 'local',
            status: StorageMessageStatus.Initial,
            data: {
              // can use placeholder values here because only the datasetID
              // is required for deleting datasets and registers from indexedDB
              ...datasetInitialValue,
              datasetID,
            },
          }
        }
      }

      const prevDate = new Date(prevProject.lastUpdated ?? 0)
      const nextDate = new Date(nextProject.lastUpdated ?? 0)

      // short-circuit if it's identical
      if (
        prevDate.getTime() === nextDate.getTime() &&
        prevProject.datasetIDs.length === nextProject.datasetIDs.length
      )
        continue

      // if the incoming project is newer than the one in state
      if (prevDate.getTime() < nextDate.getTime()) {
        nextState.projects.data = {
          ...nextState.projects.data,
          [key]: { ...nextProject, datasetIDs: nextDatasetIDs },
        }

        // if the newer incoming project
        // is from the remote save it to local
        if (payload.source === 'remote')
          nextState.messageStack = {
            ...nextState.messageStack,
            [`${APIRoutes.saveProject}_${nextProject.projectID}_local`]: {
              route: APIRoutes.saveProject,
              target: 'local',
              status: StorageMessageStatus.Initial,
              data: {
                ...nextProject,
                datasetIDs: nextDatasetIDs,
                deletedDatasetIDs: nextDeletedDatasetIDs,
              },
            },
          }
      } else {
        // if the incoming project is older than the one in state
        // still store the merge of the datasetID and deleted DatasetIDs
        nextState.projects.data = {
          ...nextState.projects.data,
          [key]: {
            ...prevProject,
            datasetIDs: nextDatasetIDs,
            deletedDatasetIDs: nextDeletedDatasetIDs,
          },
        }
        nextMessageStack[
          `${APIRoutes.saveProject}_${nextProject.projectID}_local`
        ] = {
          route: APIRoutes.saveProject,
          target: 'local',
          status: StorageMessageStatus.Initial,
          data: {
            ...nextProject,
            datasetIDs: nextDatasetIDs,
            deletedDatasetIDs: nextDeletedDatasetIDs,
          },
        }
      }
    } else {
      // if the project is new in state, add it
      nextState.projects.data = {
        ...nextState.projects.data,
        [key]: nextProject,
      }

      // and add to the queue to store it
      if (payload.source === 'remote') {
        nextMessageStack[
          `${APIRoutes.saveProject}_${nextProject.projectID}_local`
        ] = {
          route: APIRoutes.saveProject,
          target: 'local',
          status: StorageMessageStatus.Initial,
          data: nextProject,
        }
      }
    }
  }

  nextState.messageStack = nextMessageStack

  return nextState
}

export default updateProjects
