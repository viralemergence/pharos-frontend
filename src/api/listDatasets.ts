import { Dataset } from 'reducers/projectReducer/types'

const listDatasets = async (researcherID: string) => {
  const response = await fetch(`${process.env.GATSBY_API_URL}/list-datasets`, {
    method: 'POST',
    body: `{"researcherID":"${researcherID}"}`,
  })

  if (!response || !response.ok) return null

  const body = await response.json()

  const datasetList = body.datasets as Dataset[]

  return datasetList
}

export default listDatasets
