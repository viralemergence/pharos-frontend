import React, { createContext, useEffect, useReducer } from 'react'

import { Dataset, Datasets, DatasetsStatus, DatasetStatus } from './types'
import datasetsReducer, {
  DatasetsAction,
  DatasetsActions,
  datasetsInitialValue,
} from './datasetsReducer'

import useUser from 'hooks/useUser'

type DatasetsContextValue = [Datasets, React.Dispatch<DatasetsAction>]

interface DatasetContextProviderProps {
  children: React.ReactNode
}

export const DatasetsContext = createContext<DatasetsContextValue | null>(null)

const DatasetsContextProvider = ({ children }: DatasetContextProviderProps) => {
  const [user] = useUser()
  const researcherID = user.data?.researcherID

  const [datasets, datasetsDispatch] = useReducer(
    datasetsReducer,
    datasetsInitialValue
  )

  // any time the user ID changes, update the datasets automatically
  useEffect(() => {
    const getDatasetList = async (researcherID: string) => {
      // set status to loading
      datasetsDispatch({
        type: DatasetsActions.SetStatus,
        payload: DatasetsStatus.Loading,
      })

      // api request
      const response = await fetch(
        `${process.env.GATSBY_API_URL}/list-datasets`,
        {
          method: 'POST',
          body: `{"researcherID":"${researcherID}"}`,
        }
      ).catch(() => {
        datasetsDispatch({
          type: DatasetsActions.SetStatus,
          payload: DatasetsStatus.NetworkError,
        })
      })

      if (!response) {
        datasetsDispatch({
          type: DatasetsActions.SetStatus,
          payload: DatasetsStatus.NetworkError,
        })
        return undefined
      }

      // get list of datasets from json
      const { datasets: datasetList } = await response.json()

      // object to contain the datasets
      const datasetsObj: Datasets = {
        datasets: {},
        status: DatasetsStatus.Loaded,
      }

      // insert the datasets by key
      datasetList.forEach((dataset: Dataset) => {
        if (!dataset.datasetID) throw new Error('Dataset missing datasetID')
        // set status to saved, because if it's coming from the
        // server than it must be saved on the server by definition
        datasetsObj.datasets[dataset.datasetID] = {
          ...dataset,
          status: DatasetStatus.Saved,
        }
      })

      // dispatch SetDatasets action
      datasetsDispatch({
        type: DatasetsActions.SetDatasets,
        payload: datasetsObj,
      })

      // set datasets status to loaded
      datasetsDispatch({
        type: DatasetsActions.SetStatus,
        payload: DatasetsStatus.Loaded,
      })
    }

    if (researcherID) getDatasetList(researcherID)
  }, [researcherID])

  return (
    <DatasetsContext.Provider value={[datasets, datasetsDispatch]}>
      {children}
    </DatasetsContext.Provider>
  )
}

export default DatasetsContextProvider
