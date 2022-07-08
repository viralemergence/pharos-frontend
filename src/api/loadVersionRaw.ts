const loadVersionRaw = async (researcherID: string, uri: string) => {
  const response = await fetch(`${process.env.GATSBY_API_URL}/read-version`, {
    method: 'POST',
    body: JSON.stringify({ researcherID, key: uri }),
  })

  if (!response || !response.ok) return null

  const body = await response.json()

  return JSON.parse(body.response)
}

export default loadVersionRaw
