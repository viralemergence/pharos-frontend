import useDataset from 'hooks/dataset/useDataset'
import { Datapoint, RecordWithID } from 'reducers/stateReducer/types'

import defaultColumns from '../../../config/defaultColumns.json'
import useRegister from './useRegister'

// recursively traverse the linked list until the
// version number is satisfied for a given datapoint
const getDatapointAtVersion = (
  datapoint: Datapoint | undefined,
  version: number
): Datapoint | undefined => {
  if (!datapoint) return undefined
  if (Number(datapoint.version) > version)
    return getDatapointAtVersion(datapoint.previous, version)
  return datapoint
}

// hook to provide access to the rows of an arbitrary
// version of a register for displaying in the table
const useVersionedRows = () => {
  const register = useRegister()
  const dataset = useDataset()

  // load colNames from config json
  const colNames: { [key: string]: { type: string } } = defaultColumns.columns

  // if the register is not available, return empty []
  if (!dataset || !register || Object.keys(register).length === 0)
    return { rows: [], colNames: [...Object.keys(colNames)] }

  const version = dataset.activeVersion

  // check if version number requested is higher than
  // the length of the versions array; this means we
  // can directly return the array of DataPoints in
  // the register without performing version checks
  if (version >= dataset.versions.length - 1) {
    const rows: RecordWithID[] = []

    // add column names for non-default columns
    for (const [recordID, record] of Object.entries(register)) {
      for (const key of Object.keys(record)) {
        if (!colNames[key]) colNames[key] = { type: 'string' }
      }

      rows.push({ ...record, _meta: { recordID } })
    }

    return { rows, colNames: [...Object.keys(colNames)] }
  }

  // else return datapoints that are valid for the target version
  return {
    rows: Object.entries(register).reduce((row, [recordID, record]) => {
      const datapoints = Object.entries(record).reduce(
        (rec, [key, datapoint]) => {
          const versioned = getDatapointAtVersion(datapoint, version)
          // only set the key if the datapoint exists in that version
          return { ...rec, ...(versioned && { [key]: versioned }) }
        },
        {}
      )
      // only create the row if it has datapoints in the given version
      if (Object.keys(datapoints).length > 0)
        row.push({ ...datapoints, _meta: { recordID } })
      return row
    }, [] as RecordWithID[]),
    colNames: ['Row ID'],
  }
}

export default useVersionedRows
