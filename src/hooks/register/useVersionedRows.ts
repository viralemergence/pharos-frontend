import useDataset from 'hooks/dataset/useDataset'
import { Datapoint } from 'reducers/projectReducer/types'

// recursively traverse the linked list until the
// version number is satisfied for a given datapoint
const getDatapointAtVersion = (
  datapoint: Datapoint,
  version: number
): Datapoint => {
  if (datapoint.version > version && datapoint.previous)
    return getDatapointAtVersion(datapoint.previous, version)
  return datapoint
}

// placeholder for hook to provide access to the rows
// of an arbitrary version for displaying in the table
const useVersionedRows = () => {
  const dataset = useDataset()

  // check if version number requested is higher than
  // the length of the versions array; this means we
  // can directly return the array of DataPoints in
  // the register without performing version checks
  if (dataset.activeVersion >= dataset.versions.length)
    return Object.entries(dataset.register).map(([recordID, record]) => ({
      ...record,
      recordID,
    }))

  // else return datapoints that are valid for the target version
  return Object.entries(dataset.register).map(([recordID, record]) => ({
    ...Object.entries(record).reduce(
      (rec, [key, datapoint]) => ({
        ...rec,
        [key]: getDatapointAtVersion(datapoint, dataset.activeVersion),
      }),
      {}
    ),
    recordID,
  }))
}

export default useVersionedRows
