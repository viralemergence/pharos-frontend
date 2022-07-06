import { useEffect, useState } from 'react'
import useUser from './useUser'

export interface DatasetList {
  [key: string]: {
    name: string
    samples_taken: boolean
    detection_run: boolean
    versions: {
      uri: string
      date: string
    }[]
  }
}

const useDatasetList = () => {
  const [user] = useUser()

  const researcherID = user.data?.researcherID

  const [datasetList, setDatasetList] = useState<DatasetList | null>(null)

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

      const data = await response.json()

      setDatasetList(data)
    }

    if (researcherID) getDatasetList(researcherID)
  }, [researcherID])

  return datasetList
}

export default useDatasetList
