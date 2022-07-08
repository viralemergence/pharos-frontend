import { DatasetRow, Version } from 'reducers/datasetsReducer/types'

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
    version: { key: string; date: string }
  }

  return body.version
}

export default saveVersion
