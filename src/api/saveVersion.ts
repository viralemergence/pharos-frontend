import { Record } from 'reducers/projectReducer/types'

const saveVersion = async (
  rows: Record[],
  datasetID: string,
  researcherID: string
) => {
  const response = await fetch(`${process.env.GATSBY_API_URL}/upload-version`, {
    method: 'POST',
    body: JSON.stringify({
      researcherID,
      datasetID: Number(datasetID),
      rows,
    }),
  })

  if (!response || !response.ok) return null

  const body = (await response.json()) as {
    key: string
    date: string
  }

  return body
}

export default saveVersion
