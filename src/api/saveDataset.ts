import { Dataset } from 'reducers/projectReducer/types'

// export interface SaveDatasetPayload {
//   name: Dataset['name']
//   datasetID: Dataset['datasetID']
//   researcherID: Dataset['researcherID']
//   date_collected: Dataset['date_collected']
//   versions: Dataset['versions']
// }

// calling this Save Dataset becasue the dataset has already been created on the frontend
const saveDataset = async (payload: Dataset) => {
  const convertedID = { ...payload, datasetID: payload.datasetID }

  const response = await fetch(`${process.env.GATSBY_API_URL}/save-dataset`, {
    method: 'POST',
    body: JSON.stringify(convertedID),
  }).catch(error => console.log(error))

  if (!response || !response.ok) return false
  return true
}

export default saveDataset
