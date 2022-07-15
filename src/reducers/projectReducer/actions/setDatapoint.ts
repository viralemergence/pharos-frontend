import { ActionFunction, ProjectActions } from '../projectReducer'
import { Datapoint, Project } from '../types'

export interface SetDatapointPayload {
  datasetID: string
  datapoint: Partial<Datapoint>
  recordKey: string // ideally strings
  datapointKey: string // ideally strings
}

export interface SetDatapointAction {
  type: ProjectActions.SetDatapoint
  payload: SetDatapointPayload
}

const setDatapoint: ActionFunction<SetDatapointPayload> = (
  state,
  payload
  // I'm specifying a return type here to get
  // errors if the return types aren't Projects
): Project => {
  console.log(payload.recordKey)
  console.log(payload.datapointKey)

  // Datapoint does not exist -> create datapoint
  if (payload.datapoint.version === undefined)
    return {
      ...state,
      datasets: {
        ...state.datasets,
        [payload.datasetID]: {
          ...state.datasets[payload.datasetID],
          // need to go in to the register
          register: {
            ...state.datasets[payload.datasetID].register,
            [payload.recordKey]: {
              ...state.datasets[payload.datasetID].register[payload.recordKey],
              [payload.datapointKey]: {
                // we have to give all required keys
                // default values so it's impossible
                // to create datapoints without them
                displayValue: '',
                dataValue: '',
                version: state.datasets[payload.datasetID].activeVersion,
                ...payload.datapoint,
              },
            },
          },
        },
      },
    }

  if (
    // Datapoint exists and has not been edited
    state.datasets[payload.datasetID].versions.length >=
    payload.datapoint.version
  ) {
    return {
      ...state,
      datasets: {
        ...state.datasets,
        [payload.datasetID]: {
          ...state.datasets[payload.datasetID],
          [payload.recordKey]: {
            ...state.datasets[payload.datasetID].register[payload.recordKey],
            [payload.datapointKey]: {
              ...state.datasets[payload.datasetID].register[payload.recordKey][
                payload.datapointKey
              ],
              dataValue: payload.datapoint,
              version: state.datasets[payload.datasetID].activeVersion,
              previous:
                state.datasets[payload.datasetID].register[payload.recordKey][
                  payload.datapointKey
                ],
            },
          },
        },
      },
    }
  } else {
    // Datapoint exists and has been edited but not saves
    return {
      ...state,
      datasets: {
        ...state.datasets,
        [payload.datasetID]: {
          ...state.datasets[payload.datasetID],
          [payload.recordKey]: {
            ...state.datasets[payload.datasetID].register[payload.recordKey],
            [payload.datapointKey]: {
              dataValue: payload.datapoint,
            },
          },
        },
      },
    }
  }
}

export default setDatapoint
