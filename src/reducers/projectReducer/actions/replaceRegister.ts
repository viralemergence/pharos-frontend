import { ActionFunction, ProjectActions } from '../projectReducer'
import { Register } from '../types'

export interface ReplaceRegisterPayload {
  datasetID: string
  register: Register
}

export interface ReplaceRegisterAction {
  type: ProjectActions.ReplaceRegister
  payload: ReplaceRegisterPayload
}

const replaceRegister: ActionFunction<ReplaceRegisterPayload> = (
  state,
  payload
) => ({
  ...state,
  datasets: {
    ...state.datasets,
    [payload.datasetID]: {
      ...state.datasets[payload.datasetID],
      // have to unpack the "status" value from payload
      register: payload.register,
    },
  },
})

export default replaceRegister
