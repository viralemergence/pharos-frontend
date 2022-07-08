import useProject from './useProject'

const useDataset = (datasetID: string | undefined) => {
	const [project] = useProject()

	if (!datasetID) return undefined

	return project.datasets[datasetID]
}

export default useDataset
