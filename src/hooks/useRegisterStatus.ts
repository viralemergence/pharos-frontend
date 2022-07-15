import useDataset from './dataset/useDataset'

const useRegisterStatus = () => {
  const dataset = useDataset()
  return dataset.registerStatus
}

export default useRegisterStatus
