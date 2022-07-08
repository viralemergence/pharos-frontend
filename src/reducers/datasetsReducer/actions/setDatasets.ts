import { ActionFunction, DatasetsActions } from '../datasetsReducer'
import { Datasets } from '../types'

export interface SetDatasetsAction {
  type: DatasetsActions.SetDatasets
  payload: Datasets
}

// action function to change views
const setDatasets: ActionFunction<Datasets> = (state, payload) => ({
  ...state,
  ...payload,
})

export default setDatasets
