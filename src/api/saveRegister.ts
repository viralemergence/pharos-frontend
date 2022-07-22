import { Register, Version } from 'reducers/projectReducer/types'

interface UploadVersion {
  datasetID: string
  researcherID: string
  rows: {
    register: Register
    versions: Version[]
  }
}

const saveRegister = async ({
  researcherID,
  datasetID,
  rows,
}: UploadVersion) => {
  const response = await fetch(`${process.env.GATSBY_API_URL}/save-register`, {
    method: 'POST',
    body: JSON.stringify({
      researcherID,
      datasetID,
      // rows needs to be renamed
      rows,
      // date is no longer necessary
      date: '',
    }),
  })

  if (!response || !response.ok) return null

  const body = (await response.json()) as { key: string }

  return body.key
}

export default saveRegister
