const loadRegister = async (researcherID: string, key: string) => {
  const response = await fetch(`${process.env.GATSBY_API_URL}/load-register`, {
    method: 'POST',
    body: JSON.stringify({ researcherID, key }),
  })

  if (!response || !response.ok) return null

  const body = await response.json()

  return JSON.parse(body.response)
}

export default loadRegister
