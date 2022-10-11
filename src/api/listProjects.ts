import { Project } from 'reducers/stateReducer/types'

const listProjects = async (researcherID: string) => {
  const response = await fetch(`${process.env.GATSBY_API_URL}/list-projects`, {
    method: 'POST',
    body: JSON.stringify({ researcherID }),
  }).catch(error => console.log(error))

  if (!response || !response.ok) return null

  const projects = (await response.json()) as Project[]

  return projects
}

export default listProjects
