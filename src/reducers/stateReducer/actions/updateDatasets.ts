import { ActionFunction, StateActions } from '../stateReducer'
import { Dataset, RegisterPage } from '../types'
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

  // by default don't create new state if nothing changed
  let nextState = state

  if (source === 'remote') {
    nextState = { ...state }
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
          const nextPages: { [key: string]: RegisterPage } = {}

          // keep local pages lastUpdated and merged status
          if (prevData.registerPages)
            for (const [pageKey, page] of Object.entries(prevData.registerPages)) {
              nextPages[pageKey] = page
            }

          // extend with remote pages but override merged to false
          if (nextData.registerPages)
            for (const [pageKey, page] of Object.entries(nextData.registerPages)) {
              if (!nextPages[pageKey])
                nextPages[pageKey] = { lastUpdated: page.lastUpdated, merged: false }
            }

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
    // only replace the datasets object in state if the
    // datasets coming from local are different than
    // what is in state already
    let replaceDatasets = false
    if (Object.keys(state.datasets.data).length !== Object.keys(data).length)
      replaceDatasets = true
    else
      for (const [key, dataset] of Object.entries(data)) {
        const prev = state.datasets.data[key]
        const next = dataset
        if (!prev) {
          replaceDatasets = true
          break
        }
        if (prev.lastUpdated !== next.lastUpdated) {
          replaceDatasets = true
          break
        }
      }

    if (replaceDatasets) {
      nextState = { ...state }
      nextState.datasets.data = data
    }
  }

  return nextState
}

export default updateDatasets
