import { ActionFunction, ProjectActions } from '../projectReducer'
import { RegisterStatus } from '../types'

export interface SetRegisterStatusPayload {
  datasetID: string
  status: RegisterStatus
}

export interface SetRegisterStatusAction {
  type: ProjectActions.SetRegisterStatus
  payload: SetRegisterStatusPayload
}

const setRegisterStatus: ActionFunction<SetRegisterStatusPayload> = (
  state,
  payload
) => {
  // const activeVersion = state.datasets[payload.datasetID].activeVersion
  // const nextVersions = [...(state.datasets[payload.datasetID].versions ?? [])]

  // if (payload.status === VersionStatus.Saved) {
  //   console.log('changing to saved status, resetting modified')
  //   nextVersions[activeVersion].rows = nextVersions[activeVersion].rows?.map(
  //     row => {
  //       for (const key in row) {
  //         row[key] = { ...row[key], unsaved: false }
  //       }
  //       return row
  //     }
  //   )
  // }

  // nextVersions[activeVersion] = {
  //   ...nextVersions[activeVersion],
  //   status: payload.status,
  // }


  return {
    ...state,
    datasets: {
      ...state.datasets,
      [payload.datasetID]: {
        ...state.datasets[payload.datasetID],
        // have to unpack the "status" value from payload
        registerStatus: payload.status,
      },
    },
  }
}

export default setRegisterStatus
