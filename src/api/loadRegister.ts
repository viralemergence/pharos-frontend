interface LoadRegister {
  researcherID: string
  registerID: string
}

const loadRegister = async ({ researcherID, registerID }: LoadRegister) => {
  const response = await fetch(`${process.env.GATSBY_API_URL}/load-register`, {
    method: 'POST',
    body: JSON.stringify({ researcherID, registerID }),
  })

  if (!response || !response.ok) return null

  const body = await response.json()

  return JSON.parse(body.response)
}

export default loadRegister
