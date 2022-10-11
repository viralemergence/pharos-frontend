import useAppState from 'hooks/useAppState'

const useDatasets = () => {
  const {
    datasets: { data: datasets },
  } = useAppState()

  return datasets
}

export default useDatasets
