import useDataset from 'hooks/dataset/useDataset'
import { Datapoint, RecordWithID } from 'reducers/projectReducer/types'
import generateID from 'utilities/generateID'

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

// placeholder for hook to provide access to the rows
// of an arbitrary version for displaying in the table
const useVersionedRows = () => {
  const dataset = useDataset()

  // if the register is not available, return empty []
  if (!dataset.register) return []

  const version = dataset.activeVersion

  // check if version number requested is higher than
  // the length of the versions array; this means we
  // can directly return the array of DataPoints in
  // the register without performing version checks
  if (version >= dataset.versions.length - 1) {
    const newRows = Object.entries(dataset.register).map(
      ([recordID, record]) =>
        ({
          ...record,
          _meta: { recordID },
        } as RecordWithID)
    )

    // add empty row for editing at the bottom
    newRows.push(
      Object.keys(newRows[0] ?? {}).reduce(
        (acc, key) => ({
          ...acc,
          ...(key !== '_meta' && {
            [key]: {
              displayValue: '',
              dataValue: '',
              version: String(dataset.versions.length),
            },
          }),
        }),
        { _meta: { recordID: generateID.recordID() } }
      ) as RecordWithID
    )

    return newRows
  }

  // else return datapoints that are valid for the target version
  return Object.entries(dataset.register).reduce((row, [recordID, record]) => {
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
  }, [] as RecordWithID[])
}

export default useVersionedRows
