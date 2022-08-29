import { Project } from 'reducers/projectReducer/types'

// calling this Save Dataset becasue the dataset has already been created on the frontend
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
