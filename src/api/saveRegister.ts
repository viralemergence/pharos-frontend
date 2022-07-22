import { Register, Version } from 'reducers/projectReducer/types'

interface SaveRegisterPayload {
  datasetID: string
  researcherID: string
  data: {
    register: Register
    versions: Version[]
  }
}

const saveRegister = async ({
  researcherID,
  datasetID,
  data,
}: SaveRegisterPayload) => {
  const response = await fetch(`${process.env.GATSBY_API_URL}/save-register`, {
    method: 'POST',
    body: JSON.stringify({
      researcherID,
      datasetID,
      data,
    }),
  })

  if (!response || !response.ok) return null

  return true
}

export default saveRegister
