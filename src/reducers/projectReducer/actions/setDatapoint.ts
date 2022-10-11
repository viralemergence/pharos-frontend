import { ActionFunction, StateActions } from '../stateReducer'
import {
  Datapoint,
  DatasetReleaseStatus,
  DatasetStatus,
  Project,
  ProjectStatus,
  RegisterStatus,
} from '../types'
import setDatasetStatus from './setDatasetStatus'
import setRegisterStatus from './setRegisterStatus'

export interface SetDatapointPayload {
  datasetID: string
  recordID: string
  datapointID: string
  lastUpdated: string
  datapoint: {
    displayValue: Datapoint['displayValue']
    dataValue: Datapoint['dataValue']
    modifiedBy: Datapoint['modifiedBy']
  }
}

export interface SetDatapointAction {
  type: StateActions.SetDatapoint
  payload: SetDatapointPayload
}

const setDatapoint: ActionFunction<SetDatapointPayload> = (
  state,
  { datasetID, recordID, datapointID, lastUpdated, datapoint: newData }
): Project => {
  const prevDataset = state.datasets[datasetID]

  // get the previous record, if it's undefined make a new record
  const prevRecord = prevDataset.register?.[recordID] ?? {}

  // version for the new datapoint
  const version = String(prevDataset.versions.length)
  const previous = prevRecord[datapointID]

  if (previous?.displayValue === newData.displayValue) return state

  // next datapoint is all the previous data, overwritten with
  // the values from the payload, with the next version number
  // and the previous datapoint in the previous property
  const nextDatapoint = {
    ...previous,
    ...newData,
    version,
    ...(version !== previous?.version && { previous }),
  }

  let nextState: Project = {
    ...state,
    lastUpdated,
    status: ProjectStatus.Unsaved,
    datasets: {
      ...state.datasets,
      [datasetID]: {
        ...prevDataset,
        lastUpdated,
        status: DatasetStatus.Unsaved,
        releaseStatus: DatasetReleaseStatus.Unreleased,
        highestVersion: prevDataset.versions.length,
        register: {
          ...prevDataset.register,
          [recordID]: {
            ...prevRecord,
            [datapointID]: {
              ...nextDatapoint,
            },
          },
        },
      },
    },
  }

  nextState = setDatasetStatus(nextState, {
    datasetID,
    status: DatasetStatus.Unsaved,
  })

  // always set the registerStatus to
  // unsaved when a new datapoint is set
  nextState = setRegisterStatus(nextState, {
    datasetID,
    status: RegisterStatus.Unsaved,
  })

  return nextState
}

export default setDatapoint
