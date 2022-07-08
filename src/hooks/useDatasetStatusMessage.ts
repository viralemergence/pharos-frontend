import { DatasetStatus } from 'reducers/projectReducer/types'
import useDataset from './useDatset'

const useDatasetStatusMessage = (datasetID: string | undefined) => {
	const dataset = useDataset(datasetID)

	if (!dataset) return 'No dataset'

	let datasetStatusMessage = 'Error'
	switch (dataset.status) {
		case DatasetStatus.Saved:
			datasetStatusMessage = 'Dataset saved'
			break
		case DatasetStatus.Saving:
			datasetStatusMessage = 'Saving...'
			break
		case DatasetStatus.Unsaved:
			datasetStatusMessage = 'Dataset not saved'
			break
		case DatasetStatus.Error:
			datasetStatusMessage = 'Error'
	}

	return datasetStatusMessage
}

export default useDatasetStatusMessage
