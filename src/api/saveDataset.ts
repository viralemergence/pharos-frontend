import { Dataset, Version } from 'reducers/projectReducer/types'

export interface SaveDatasetProps {
  datasetID: string
  researcherID: string
  name: string
  date_collected: string
  samples_taken: string
  detection_run: string
  versions: Version[]
}

// calling this Save Dataset becasue the dataset has already been created on the frontend
const saveDataset = async (payload: SaveDatasetProps) => {
  const convertedID = { ...payload, datasetID: Number(payload.datasetID) }

  const response = await fetch(`${process.env.GATSBY_API_URL}/create-dataset`, {
    method: 'POST',
    body: JSON.stringify(convertedID),
  }).catch(error => console.log(error))

  if (!response || !response.ok) return null
  return (await response.json()) as Dataset
}

export default saveDataset
