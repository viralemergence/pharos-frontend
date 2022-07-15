import { ActionFunction, ProjectActions } from '../projectReducer'

export interface SetRegisterKeyPayload {
  datasetID: string
  key: string
}

export interface SetRegisterKeyAction {
  type: ProjectActions.SetRegisterKey
  payload: SetRegisterKeyPayload
}

const setRegisterKey: ActionFunction<SetRegisterKeyPayload> = (
  state,
  payload
) => ({
  ...state,
  datasets: {
    ...state.datasets,
    [payload.datasetID]: {
      ...state.datasets[payload.datasetID],
      registerKey: payload.key,
    },
  },
})

export default setRegisterKey
