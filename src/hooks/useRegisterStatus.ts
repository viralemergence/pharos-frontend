import useDataset from './useDataset'

const useRegisterStatus = (datasetID: string | undefined) => {
  const dataset = useDataset(datasetID)

  if (!dataset) return undefined
  return dataset.registerStatus
}

export default useRegisterStatus
