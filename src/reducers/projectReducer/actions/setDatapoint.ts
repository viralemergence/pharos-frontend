import { ActionFunction, ProjectActions } from '../projectReducer'
import { Datapoint, Project, RegisterStatus } from '../types'
import setRegisterStatus from './setRegisterStatus'

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
  { datasetID, recordID, datapointID, datapoint: newData }
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

  let nextState = {
    ...state,
    datasets: {
      ...state.datasets,
      [datasetID]: {
        ...prevDataset,
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

  // always set the registerStatus to
  // unsaved when a new datapoint is set
  nextState = setRegisterStatus(nextState, {
    datasetID,
    status: RegisterStatus.Unsaved,
  })

  return nextState
}

export default setDatapoint
