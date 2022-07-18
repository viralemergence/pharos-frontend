import { ActionFunction, ProjectActions } from '../projectReducer'
import { Datapoint, Project } from '../types'

export interface SetDatapointPayload {
  datasetID: string
  datapoint: Partial<Datapoint>
  recordID: string // ideally strings
  datapointID: string // ideally strings
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
  console.log(payload.recordID)
  console.log(payload.datapointID)

  const prevDatapoint =
    state.datasets[payload.datasetID].register[payload.recordID][
      payload.datapointID
    ]

  const dataset = state.datasets[payload.datasetID]

  let nextDatapoint: Partial<Datapoint>

  switch (true) {
    case prevDatapoint === undefined:
      nextDatapoint = {
        displayValue: '',
        dataValue: '',
        version: 0,
        ...payload.datapoint,
      }
      break

    case dataset.versions.length >= prevDatapoint.version:
      nextDatapoint = {
        ...prevDatapoint,
        ...payload.datapoint,
        previous: prevDatapoint,
      }
      break

    default:
      nextDatapoint = {
        ...prevDatapoint,
        ...payload.datapoint,
      }
      break
  }
  return {
    ...state,
    datasets: {
      ...state.datasets,
      [payload.datasetID]: {
        ...state.datasets[payload.datasetID],
        // need to go in to the register
        register: {
          ...dataset.register,
          [payload.recordID]: {
            ...dataset.register[payload.recordID],
            [payload.datapointID]: {
              // we have to give all required keys
              // default values so it's impossible
              // to create datapoints without them
              //displayValue: '',
              // dataValue: '',
              //version: dataset.activeVersion,
              ...nextDatapoint,
            },
          },
        },
      },
    },
  }
}

// if (prevDatapoint) {

//   nextDatapoint = {
//     displayValue: '',
//     dataValue: '',
//     version: 0,
//     ...payload.datapoint,
//   }

// if (dataset.versions.length >= prevDatapoint.version)
//   nextDatapoint = {
//     ...prevDatapoint,
//     ...payload.datapoint,
//     previous: prevDatapoint,
//   }

// if (dataset.versions.length >= prevDatapoint.version)
//   nextDatapoint = {
//     ...prevDatapoint,
//     ...payload.datapoint,
//     previous: prevDatapoint,
//   }

// Datapoint does not exist -> create datapoint
// if (payload.datapoint.version === undefined)
//   return {
//     ...state,
//     datasets: {
//       ...state.datasets,
//       [payload.datasetID]: {
//         ...state.datasets[payload.datasetID],
//         // need to go in to the register
//         register: {
//           ...state.datasets[payload.datasetID].register,
//           [payload.recordID]: {
//             ...state.datasets[payload.datasetID].register[payload.recordID],
//             [payload.datapointID]: {
//               // we have to give all required keys
//               // default values so it's impossible
//               // to create datapoints without them
//               displayValue: '',
//               dataValue: '',
//               version: state.datasets[payload.datasetID].activeVersion,
//               ...payload.datapoint,
//             },
//           },
//         },
//       },
//     },
//   }

// if (
//   // Datapoint exists and has not been edited
//   state.datasets[payload.datasetID].versions.length >=
//   payload.datapoint.version
// ) {
//   return {
//     ...state,
//     datasets: {
//       ...state.datasets,
//       [payload.datasetID]: {
//         ...state.datasets[payload.datasetID],
//         [payload.recordID]: {
//           ...state.datasets[payload.datasetID].register[payload.recordID],
//           [payload.datapointID]: {
//             ...state.datasets[payload.datasetID].register[payload.recordID][
//               payload.datapointID
//             ],
//             dataValue: payload.datapoint,
//             version: state.datasets[payload.datasetID].activeVersion,
//             previous:
//               state.datasets[payload.datasetID].register[payload.recordID][
//                 payload.datapointID
//               ],
//           },
//         },
//       },
//     },
//   }
// } else {
// Datapoint exists and has been edited but not saves

//   }
// }

export default setDatapoint
