import { ActionFunction, ProjectActions } from '../projectReducer'
import { Datapoint } from '../types'

export interface SetDatapointPayload {
  datasetID: string
  datapoint: Partial<Datapoint>
}

export interface SetDatapointAction {
  type: ProjectActions.SetDatapoint
  payload: SetDatapointPayload
}

const setDatapoint: ActionFunction<SetDatapointPayload> = (state, payload) => {
  console.log(payload)
  return state
}

export default setDatapoint
