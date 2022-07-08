import { Record } from 'reducers/projectReducer/types'

const saveVersion = async (
  rows: Record[],
  datasetID: string,
  researcherID: string,
  date: string
) => {
  const response = await fetch(`${process.env.GATSBY_API_URL}/upload-version`, {
    method: 'POST',
    body: JSON.stringify({ researcherID, datasetID, date, rows }),
  })

  if (!response || !response.ok) return null

  const body = (await response.json()) as { key: string }

  return body
}

export default saveVersion
