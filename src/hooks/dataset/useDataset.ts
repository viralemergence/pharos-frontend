import { useEffect } from 'react'

import { datasetInitialValue } from 'reducers/projectReducer/projectReducer'

import useAppState from '../project/useProject'
import useProjectID from 'hooks/project/useProjectID'
import useDatasetID from './useDatasetID'

const useDataset = () => {
  const state = useAppState()
  const projectID = useProjectID()
  const datasetID = useDatasetID()

  const project = state.projects[projectID]
  const dataset = project?.datasets[datasetID]

  //   // effect to load the datasets or pull
  //   // them from local storage as necessary
  //   useEffect(() => {
  //     const requestDatasets = async () => {}

  //     if (!project.datasets) {

  //     }
  //   }, [project, dataset, projectID, datasetID])

  return dataset ?? datasetInitialValue
}

export default useDataset
