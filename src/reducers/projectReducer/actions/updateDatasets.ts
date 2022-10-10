import { ActionFunction, ProjectActions } from '../projectReducer'
import { Dataset, NodeStatus } from '../types'
import {
  APIRoutes,
  StorageMessageStatus,
} from 'storage/synchronizeMessageQueue'

interface SetDatasetsActionPayload {
  source: 'local' | 'remote' | 'reset'
  data: { [key: string]: Dataset }
}

export interface UpdateDatasetsAction {
  type: ProjectActions.UpdateDatasets
  payload: SetDatasetsActionPayload
}

const updateDatasets: ActionFunction<UpdateDatasetsAction['payload']> = (
  state,
  payload
) => {
  const { data, source } = payload

  if (source === 'reset')
    return {
      ...state,
      datasets: {
        status: NodeStatus.Drifted,
        data: {},
      },
    }

  const nextState = { ...state }

  for (const [key, nextData] of Object.entries(data)) {
    const prevData = state.datasets.data[nextData.datasetID]

    // if the project already exists in state
    if (state.projects.data[key]) {
      const prevDate = new Date(prevData.lastUpdated ?? 0)
      const nextDate = new Date(nextData.lastUpdated ?? 0)

      // short-circuit if it's identical
      if (prevDate.getTime() === nextDate.getTime()) continue

      // if the incoming project is newer than the one in state
      if (prevDate.getTime() < nextDate.getTime()) {
        nextState.datasets.data = {
          ...nextState.datasets.data,
          [key]: nextData,
        }

        // if the newer incomeing project
        // is from the remote save it to local
        if (source === 'remote')
          nextState.messageStack = {
            ...nextState.messageStack,
            [`${APIRoutes.saveDataset}_${nextData.datasetID}_local`]: {
              route: APIRoutes.saveDataset,
              target: 'local',
              status: StorageMessageStatus.Initial,
              data: nextData,
            },
          }
      }
    } else {
      // if the project is new in state, add it
      nextState.datasets.data = { ...nextState.datasets.data, [key]: nextData }

      // and add to the queue to store it
      if (source === 'remote')
        nextState.messageStack = {
          ...nextState.messageStack,
          [`${APIRoutes.saveDataset}_${nextData.datasetID}_local`]: {
            route: APIRoutes.saveDataset,
            target: 'local',
            status: StorageMessageStatus.Initial,
            data: nextData,
          },
        }
    }
  }

  return nextState
}

export default updateDatasets
