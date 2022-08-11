import { Project } from 'reducers/projectReducer/types'

const saveProject = async (payload: Project) => {
  const response = await fetch(`${process.env.GATSBY_API_URL}/save-project`, {
    method: 'POST',
    body: JSON.stringify(payload),
  }).catch(error => console.log(error))

  if (!response || !response.ok) return false
  return true
}

export default saveProject
