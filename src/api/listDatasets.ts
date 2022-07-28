import { Dataset } from 'reducers/projectReducer/types'

const listDatasets = async (researcherID: string) => {
  const response = await fetch(`${process.env.GATSBY_API_URL}/list-datasets`, {
    method: 'POST',
    body: `{"researcherID":"${researcherID}"}`,
  })

  if (!response || !response.ok) return null

  const datasetList = (await response.json()) as Dataset[]

  return datasetList
}

export default listDatasets
