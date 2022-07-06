import { useEffect, useState } from 'react'
import useUser from './useUser'

export interface Dataset {
  datasetID: string
  researcherID: string
  name: string
  samples_taken: string
  detection_run: string
  versions: {
    date: string
    uri: string
  }[]
}

const useDatasetList = () => {
  const [user] = useUser()

  const researcherID = user.data?.researcherID

  const [datasetList, setDatasetList] = useState<Dataset[] | null>(null)

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

      const { datasets } = await response.json()

      setDatasetList(datasets as Dataset[])
    }

    if (researcherID) getDatasetList(researcherID)
  }, [researcherID])

  return datasetList
}

export default useDatasetList
