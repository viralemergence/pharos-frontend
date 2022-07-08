import { DatasetRow } from 'reducers/datasetsReducer/types'

const saveVersion = async (
  raw: DatasetRow[],
  datasetID: string,
  researcherID: string
) => {
  const response = await fetch(`${process.env.GATSBY_API_URL}/upload-version`, {
    method: 'POST',
    body: JSON.stringify({
      researcherID,
      datasetID: Number(datasetID),
      raw,
    }),
  })

  if (!response || !response.ok) return null

  const body = (await response.json()) as {
    dataset: { uri: string; date: string }
  }

  return body.dataset
}

export default saveVersion
