import { Register, Version } from 'reducers/projectReducer/types'

interface RegisterData {
  register: Register
  versions: Version[]
}

interface SaveRegisterPayload {
  datasetID: string
  researcherID: string
  data: RegisterData
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
  }).catch(e => console.log(e))

  if (!response || !response.ok) return null

  const registerData = (await response.json()) as RegisterData

  return registerData
}

export default saveRegister
