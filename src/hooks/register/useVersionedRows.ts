import defaultColumns from 'config/defaultColumns'
import useDataset from 'hooks/dataset/useDataset'
import { RecordWithMeta } from 'reducers/stateReducer/types'

import useRegister from './useRegister'

// // recursively traverse the linked list until the
// // version number is satisfied for a given datapoint
// const getDatapointAtVersion = (
//   datapoint: Datapoint | undefined,
//   version: number
// ): Datapoint | undefined => {
//   if (!datapoint) return undefined
//   if (Number(datapoint.version) > version)
//     return getDatapointAtVersion(datapoint.previous, version)
//   return datapoint
// }

// hook to provide access to the rows of an arbitrary
// version of a register for displaying in the table
const useVersionedRows = () => {
  const register = useRegister()
  const dataset = useDataset()

  // load colNames from config json
  const colNames: { [key: string]: { type: string } } = {
    ...defaultColumns,
  }

  // if the register is not available, return empty []
  if (!dataset || !register || Object.keys(register).length === 0)
    return { rows: [], colNames: [...Object.keys(colNames)] }

  const rows: RecordWithMeta[] = []

  // add column names for non-default columns
  Object.entries(register).forEach(([recordID, record], index) => {
    for (const key of Object.keys(record))
      if (!colNames[key]) colNames[key] = { type: 'string' }

    // mutate original record to add _meta order if it doesn't have it
    // This probably needs to find a better home somewhere else...
    record._meta = { ...record._meta, order: record._meta?.order ?? index }

    rows.push({ ...record, _meta: { recordID, order: (record as RecordWithMeta)._meta?.order } })
  })

  const sorted = rows.sort((a, b) => (a._meta.order ?? 0) - (b._meta.order ?? 0))

  // add correct row numbers after the sort has been applied
  // There's got to be a better way to do this, the grid library
  // should expose it's rowIdx variable...
  for (const [index, row] of sorted.entries()) {
    row._meta.rowNumber = index + 1
  }

  return { rows: sorted, colNames: [...Object.keys(colNames)] }

  // // else return datapoints that are valid for the target version
  // return {
  //   rows: Object.entries(register).reduce((row, [recordID, record]) => {
  //     const datapoints = Object.entries(record).reduce(
  //       (rec, [key, datapoint]) => {
  //         const versioned = getDatapointAtVersion(datapoint, version)
  //         // only set the key if the datapoint exists in that version
  //         return { ...rec, ...(versioned && { [key]: versioned }) }
  //       },
  //       {}
  //     )
  //     // only create the row if it has datapoints in the given version
  //     if (Object.keys(datapoints).length > 0)
  //       row.push({ ...datapoints, _meta: { recordID } })
  //     return row
  //   }, [] as RecordWithID[]),
  //   colNames: ['Row ID'],
  // }
}

export default useVersionedRows
