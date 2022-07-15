import useDataset from 'hooks/dataset/useDataset'
import { Datapoint, Record } from 'reducers/projectReducer/types'

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
    return Object.values(dataset.register)

  // else return datapoints that are valid for the target version
  return Object.values(dataset.register).map(record =>
    Object.entries(record).reduce(
      (rec, [key, val]) => ({
        ...rec,
        [key]: getDatapointAtVersion(val, dataset.activeVersion),
      }),
      {}
    )
  )
}

export default useVersionedRows
