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
      // const response = await fetch(`${process.env.GATSBY_API_URL}/auth`, {
      //   method: 'POST',
      //   body: `{"researcherID":"${researcherID}"}`,
      // }).catch(error => console.log(error))

      const fakeAPIResponse = {
        fa8c04b6af154da9ada72f1057d11b7f: {
          name: 'dataset 1',
          samples_taken: true,
          detection_run: false,
          versions: [
            {
              uri: 's3://someplace',
              date: '2022-06-28T21:23:54.606650',
            },
            {
              uri: 's3://someplace',
              date: '2022-06-30T21:23:54.606650',
            },
          ],
        },
        '8743ee229ed44c70aad4eeb0ae0f63fe': {
          name: 'dataset 2',
          samples_taken: true,
          detection_run: true,
          versions: [
            {
              uri: 's3://someplace',
              date: '2022-05-10T21:23:54.606650',
            },
            {
              uri: 's3://someplace',
              date: '2022-05-30T21:23:54.606650',
            },
          ],
        },
      }

      const data = fakeAPIResponse

      setDatasetList(data)
    }

    if (researcherID) getDatasetList(researcherID)
  }, [researcherID])

  return datasetList
}

export default useDatasetList
