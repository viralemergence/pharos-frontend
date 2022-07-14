import useDataset from './useDatset'

const useRegisterStatus = (datasetID: string | undefined) => {
  const dataset = useDataset(datasetID)

  if (!dataset) return undefined
  return dataset.registerStatus
}

export default useRegisterStatus
