import { ActionFunction, StateActions } from '../stateReducer'
import { RegisterStatus, Version } from '../types'
import setActiveVersion from './setActiveVersion'
import setRegisterStatus from './setRegisterStatus'

export interface CreateVersionPayload {
  datasetID: string
  version: Version
}

export interface CreateVersionAction {
  type: StateActions.CreateVersion
  payload: CreateVersionPayload
}

const createVersion: ActionFunction<CreateVersionPayload> = (
  state,
  { datasetID, version }
) => {
  let nextState = {
    ...state,
    datasets: {
      ...state.datasets,
      [datasetID]: {
        ...state.datasets[datasetID],
        versions: [
          ...(state.datasets[datasetID].versions ?? []),
          { ...version },
        ],
      },
    },
  }

  // set the new version to be active
  nextState = setActiveVersion(nextState, {
    datasetID,
    version: nextState.datasets[datasetID].versions?.length - 1 ?? 0,
  })

  // set register to unsaved
  nextState = setRegisterStatus(nextState, {
    datasetID,
    status: RegisterStatus.Unsaved,
  })

  return nextState
}

export default createVersion
