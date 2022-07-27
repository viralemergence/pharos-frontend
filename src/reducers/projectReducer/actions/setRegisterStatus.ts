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
) => ({
  ...state,
  datasets: {
    ...state.datasets,
    [payload.datasetID]: {
      ...state.datasets[payload.datasetID],
      registerStatus: payload.status,
    },
  },
})

export default setRegisterStatus
