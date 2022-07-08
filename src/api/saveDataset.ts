import { Dataset } from 'reducers/datasetsReducer/types'

export interface CreateDatasetPayload {
  datasetID: string
  researcherID: string
  name: string
  date_collected: string
  samples_taken: string
  detection_run: string
}

const saveDataset = async (payload: CreateDatasetPayload) => {
  const convertedID = { ...payload, datasetID: Number(payload.datasetID) }

  const response = await fetch(`${process.env.GATSBY_API_URL}/create-dataset`, {
    method: 'POST',
    body: JSON.stringify(convertedID),
  }).catch(error => console.log(error))

  if (!response || !response.ok) return null
  return (await response.json()) as Dataset
}

export default saveDataset
