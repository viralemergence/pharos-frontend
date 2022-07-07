import React, { createContext, useContext, useEffect, useState } from 'react'
import useUser from './useUser'

export interface Dataset {
  datasetID: string
  researcherID: string
  name: string
  samples_taken: string
  detection_run: string
  date_collected: string
  versions: {
    date: string
    uri: string
  }[]
}

export interface Datasets {
  [key: string]: Dataset
}

type DatasetContextValue = [
  Datasets,
  React.Dispatch<React.SetStateAction<Datasets>>
]

interface DatasetContextProviderProps {
  children: React.ReactNode
}

const DatasetContext = createContext<DatasetContextValue | null>(null)

export const DatasetContextProvider = ({
  children,
}: DatasetContextProviderProps) => {
  const [datasets, setDatasets] = useState<Datasets>({})

  return (
    <DatasetContext.Provider value={[datasets, setDatasets]}>
      {children}
    </DatasetContext.Provider>
  )
}

const useDatasets = () => {
  const [user] = useUser()

  const researcherID = user.data?.researcherID

  const context = useContext(DatasetContext)

  if (!context) throw new Error('Datasets context not found')

  const [datasets, setDatasets] = context

  useEffect(() => {
    const getDatasetList = async (researcherID: string) => {
      const response = await fetch(
        `${process.env.GATSBY_API_URL}/list-datasets`,
        {
          method: 'POST',
          body: `{"researcherID":"${researcherID}"}`,
        }
      ).catch(error => console.log(error))

      if (!response) {
        console.log('network error')
        return undefined
      }

      const { datasets: datasetList } = await response.json()

      const datasets: Datasets = {}

      datasetList.forEach(
        (dataset: Dataset) => (datasets[dataset.datasetID] = dataset)
      )

      setDatasets(datasets)
    }

    if (researcherID) getDatasetList(researcherID)
  }, [researcherID, setDatasets])

  return [datasets, setDatasets] as DatasetContextValue
}

export default useDatasets
