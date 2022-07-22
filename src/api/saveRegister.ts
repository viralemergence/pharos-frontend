import { Register, Version } from 'reducers/projectReducer/types'

interface SaveRegisterPayload {
  registerID: string
  researcherID: string
  data: {
    register: Register
    versions: Version[]
  }
}

const saveRegister = async ({
  researcherID,
  registerID,
  data,
}: SaveRegisterPayload) => {
  const response = await fetch(`${process.env.GATSBY_API_URL}/save-register`, {
    method: 'POST',
    body: JSON.stringify({
      researcherID,
      registerID,
      data,
    }),
  })

  if (!response || !response.ok) return null

  const body = (await response.json()) as { key: string }

  return body.key
}

export default saveRegister
