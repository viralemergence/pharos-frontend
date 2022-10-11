import generateID from 'utilities/generateID'
import { ActionFunction, StateActions } from '../projectReducer'
import { Project } from '../types'

export type Rows = { [key: string]: string }[]

export interface BatchSetDatapointPayload {
  datasetID: string
  researcherID: string
  recordIDColumn: string
  rows: Rows
}

export interface BatchSetDatapointAction {
  type: StateActions.BatchSetDatapoint
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

  const idMap: { [key: string]: string } = Object.entries(register).reduce(
    (map, [recordID, record]) => ({
      ...map,
      [record[recordIDColumn]?.displayValue]: recordID,
    }),
    {}
  )

  let setNewHighestVersion = false
  rows.forEach(row => {
    const recordID = idMap[row[recordIDColumn]] ?? generateID.recordID()
    // get datapointID keys if they already exist

    // Iterate through the record and create map of datapointID keys and datapoint displaynames

    // if they don't exist create them

    // row.forEach(cell => {
    columns.forEach(datapointID => {
      const record = register[recordID] ?? {}
      const previous = record[datapointID]
      if (previous?.displayValue !== row[datapointID]) {
        setNewHighestVersion = true
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

  if (setNewHighestVersion)
    nextState.datasets[datasetID].highestVersion =
      nextState.datasets[datasetID].versions.length

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
