import { Dataset } from 'reducers/projectReducer/types'

// calling this Save Dataset becasue the dataset has already been created on the frontend
const saveDataset = async (payload: Dataset) => {
  const convertedID = { ...payload, datasetID: payload.datasetID }

  const response = await fetch(`${process.env.GATSBY_API_URL}/create-dataset`, {
    method: 'POST',
    body: JSON.stringify(convertedID),
  }).catch(error => console.log(error))

  if (!response || !response.ok) return false
  return true
}

export default saveDataset
