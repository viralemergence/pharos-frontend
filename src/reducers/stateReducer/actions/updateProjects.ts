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

      let nextDatasetIDs = prevProject.datasetIDs
      let nextDeletedDatasetIDs = prevProject.deletedDatasetIDs ?? []

      // deep compare the previous and next datasetIDs
      // and avoid setting new arrays if the contents are unchanged
      const datasetIDsChanged =
        prevProject.datasetIDs.sort().join(',') !==
        nextProject.datasetIDs.sort().join(',')

      const deletedDatasetIDsChanged =
        (prevProject.deletedDatasetIDs ?? []).sort().join(',') !==
        (nextProject.deletedDatasetIDs ?? []).sort().join(',')

      if (deletedDatasetIDsChanged) {
        const nextDeletedDatasetIDSet = new Set(
          (nextProject.deletedDatasetIDs ?? []).concat(
            prevProject.deletedDatasetIDs ?? []
          )
        )

        nextDeletedDatasetIDs = [...nextDeletedDatasetIDSet]

        for (const datasetID of nextDeletedDatasetIDs) {
          // make sure all newly deleted datasets are deleted from indexedDB
          if (!prevProject.deletedDatasetIDs?.includes(datasetID)) {
            nextMessageStack[`${APIRoutes.deleteDataset}_${datasetID}_local`] =
              {
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
      }

      const nextDeletedDatasetIDSet = new Set(nextDeletedDatasetIDs)

      if (datasetIDsChanged)
        nextDatasetIDs = [
          ...new Set(
            nextProject.datasetIDs
              .concat(prevProject.datasetIDs)
              .filter(id => !nextDeletedDatasetIDSet.has(id))
          ),
        ]

      const prevDate = new Date(prevProject.lastUpdated ?? 0)
      const nextDate = new Date(nextProject.lastUpdated ?? 0)

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
        // even if the incoming project is older than the one in state
        // still store the merge of the datasetID and deleted DatasetIDs
        if (datasetIDsChanged || deletedDatasetIDsChanged) {
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
