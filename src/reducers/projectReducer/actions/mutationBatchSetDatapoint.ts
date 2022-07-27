import { ActionFunction, ProjectActions } from '../projectReducer'
import { Project } from '../types'

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
  console.time('lowRamBatchSetDatapoint')
  const nextState = { ...state }

  const register = nextState.datasets[datasetID].register ?? {}
  const version = String(nextState.datasets[datasetID].versions.length)
  const columns = Object.keys(rows[0])

  rows.forEach(row => {
    const recordID = row[recordIDColumn]
    columns.forEach(datapointID => {
      const record = register[recordID] ?? {}
      const previous = record[datapointID]
      if (previous?.displayValue !== row[datapointID]) {
        register[recordID] = record
        register[recordID][datapointID] = {
          displayValue: row[datapointID],
          dataValue: row[datapointID],
          modifiedBy: researcherID,
          previous,
          version,
        }
      }
    })
  })

  // This ended up being a little slower
  // though I think it should be faster
  // in theory because it doesn't have
  // the function construction and closures

  // for (const row of rows) {
  //   const recordID = row[recordIDColumn]
  //   for (const datapointID of columns) {
  //     const record = register[recordID] ?? {}
  //     const previous = record[datapointID]
  //     register[recordID] = record
  //     register[recordID][datapointID] = {
  //       displayValue: row[datapointID],
  //       dataValue: row[datapointID],
  //       modifiedBy: researcherID,
  //       previous,
  //       version,
  //     }
  //   }
  // }

  console.timeEnd('lowRamBatchSetDatapoint')
  return nextState
}

export default batchSetDatapoint
