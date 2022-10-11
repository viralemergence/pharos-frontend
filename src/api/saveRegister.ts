import { Register } from 'reducers/stateReducer/types'

interface SaveRegisterPayload {
  datasetID: string
  researcherID: string
  register: Register
}

const saveRegister = async ({
  researcherID,
  datasetID,
  register,
}: SaveRegisterPayload) => {
  const response = await fetch(`${process.env.GATSBY_API_URL}/save-register`, {
    method: 'POST',
    body: JSON.stringify({
      researcherID,
      datasetID,
      register,
    }),
  }).catch(e => console.log(e))

  if (!response || !response.ok) return null

  const nextRegister = (await response.json()) as Register

  return nextRegister
}

export default saveRegister
