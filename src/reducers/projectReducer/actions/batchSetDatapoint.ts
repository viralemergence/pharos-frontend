import { ActionFunction, ProjectActions } from '../projectReducer'
import setDatapoint from './setDatapoint'
import { Project } from '../types'
import getTimestamp from 'utilities/getTimestamp'

export type Rows = { [key: string]: string }[]

export interface BatchSetDatapointPayload {
  datasetID: string
  researcherID: string
  recordIDColumn: string
  rows: Rows
}

export interface BatchSetDatapointAction {
  type: ProjectActions.BatchSetDatapoint
  payload: BatchSetDatapointPayload
}

const batchSetDatapoint: ActionFunction<BatchSetDatapointPayload> = (
  state,
  { datasetID, researcherID, recordIDColumn, rows }
): Project => {
  console.time('batchSetDatapoint')

  let nextState = state
  const lastUpdated = getTimestamp()

  for (const row of rows) {
    const recordID = row[recordIDColumn]

    for (const [datapointID, value] of Object.entries(row)) {
      nextState = setDatapoint(nextState, {
        datasetID,
        recordID,
        datapointID,
        lastUpdated,
        datapoint: {
          displayValue: value,
          dataValue: value,
          modifiedBy: researcherID,
        },
      })
    }
  }

  console.timeEnd('batchSetDatapoint')
  return nextState
}

export default batchSetDatapoint
