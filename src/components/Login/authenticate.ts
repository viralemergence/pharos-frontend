import { User, UserStatus } from 'components/layout/UserContext'

const authenticate = async (researcherID: string) => {
  const response = await fetch(`${process.env.GATSBY_API_URL}/auth`, {
    method: 'POST',
    body: `{"researcherID":"${researcherID}"}`,
  }).catch(error => console.log(error))

  console.log(response)
  if (!response) return { status: UserStatus.authError }

  if (response.status == 403) return { status: UserStatus.invalidUser }

  if (!response.ok) return { status: UserStatus.authError }

  const data = await response.json()

  const user = {
    status: UserStatus.loggedIn,
    data: data,
  }

  return user as User
}

export default authenticate
