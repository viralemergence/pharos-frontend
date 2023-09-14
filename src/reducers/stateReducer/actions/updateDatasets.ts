import { ActionFunction, StateActions } from '../stateReducer'
import { Dataset } from '../types'
import {
  APIRoutes,
  StorageMessageStatus,
} from 'storage/synchronizeMessageQueue'

interface SetDatasetsActionPayload {
  source: 'local' | 'remote'
  data: { [key: string]: Dataset }
}

export interface UpdateDatasetsAction {
  type: StateActions.UpdateDatasets
  payload: SetDatasetsActionPayload
}

const updateDatasets: ActionFunction<UpdateDatasetsAction['payload']> = (
  state,
  payload
) => {
  const { data, source } = payload

  const nextState = { ...state }

  if (source === 'remote') {
    for (const [key, nextData] of Object.entries(data)) {
      const prevData = state.datasets.data[nextData.datasetID]

      // if the dataset already exists in state
      if (prevData) {
        const prevDate = new Date(prevData.lastUpdated ?? 0)
        const nextDate = new Date(nextData.lastUpdated ?? 0)

        // short-circuit if it's identical
        if (prevDate.getTime() === nextDate.getTime()) continue

        // if the incoming dataset is newer than the one in state
        if (prevDate.getTime() < nextDate.getTime()) {
          nextState.datasets.data = {
            ...nextState.datasets.data,
            [key]: nextData,
          }

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
        // if the dataset is new in state, add it
        nextState.datasets.data = {
          ...nextState.datasets.data,
          [key]: nextData,
        }

        // and add to the queue to store it
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
  } else {
    nextState.datasets.data = data
  }

  return nextState
}

export default updateDatasets
