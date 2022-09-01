import { Dataset } from 'reducers/projectReducer/types'

const listDatasets = async (researcherID: string, projectID: string) => {
  const response = await fetch(`${process.env.GATSBY_API_URL}/list-datasets`, {
    method: 'POST',
    body: JSON.stringify({ researcherID, projectID }),
  })

  if (!response || !response.ok) return null

  const datasets = (await response.json()) as { [key: string]: Dataset }

  return datasets
}

export default listDatasets
