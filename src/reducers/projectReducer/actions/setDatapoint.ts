import { ActionFunction, ProjectActions } from '../projectReducer'
import { Datapoint, Project } from '../types'

export interface SetDatapointPayload {
  datasetID: string
  recordID: string
  datapointID: string
  datapoint: {
    displayValue: Datapoint['displayValue']
    dataValue: Datapoint['dataValue']
    modifiedBy: Datapoint['modifiedBy']
  }
}

export interface SetDatapointAction {
  type: ProjectActions.SetDatapoint
  payload: SetDatapointPayload
}

const setDatapoint: ActionFunction<SetDatapointPayload> = (
  state,
  payload
): Project => {
  const emptyDatapoint = { displayValue: '', dataValue: '', version: '0' }

  const prevDataset = state.datasets[payload.datasetID]

  // get the previous record, if it's undefined make a new record
  const prevRecord = prevDataset.register?.[payload.recordID] ?? {}

  // get the previous datapoint, if it's undefined return an empty datapoint
  const prevDatapoint = prevRecord[payload.datapointID] ?? emptyDatapoint

  // next datapoint is all the previous, overwritten with the values from the payload
  const nextDatapoint = { ...prevDatapoint, ...payload.datapoint }

  // if the previous datapoint is in a saved version
  if (prevDataset.versions.length > Number(prevDatapoint.version)) {
    // set next datapoint to one version after the current highest
    nextDatapoint.version = String(prevDataset.versions.length + 1)
    // set the previous version into the linked list
    nextDatapoint.previous = prevDatapoint
  }

  return {
    ...state,
    datasets: {
      ...state.datasets,
      [payload.datasetID]: {
        ...prevDataset,
        register: {
          ...prevDataset.register,
          [payload.recordID]: {
            ...prevRecord,
            [payload.datapointID]: {
              ...nextDatapoint,
            },
          },
        },
      },
    },
  }
}

export default setDatapoint
