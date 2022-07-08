import { ActionFunction, DatasetsActions } from '../datasetsReducer'
import { DatasetsStatus } from '../types'

export interface SetStatusAction {
  type: DatasetsActions.SetStatus
  payload: DatasetsStatus
}

const setStatus: ActionFunction<DatasetsStatus> = (state, payload) => ({
  ...state,
  status: payload,
})

export default setStatus
