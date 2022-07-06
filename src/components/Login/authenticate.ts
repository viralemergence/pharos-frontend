import { User, UserStatus, View } from 'components/Login/UserContextProvider'

const authenticate = async (researcherID: string) => {
  // offline debugging
  // return {
  //   status: UserStatus.loggedIn,
  //   statusMessage: 'Logged in',
  //   view: View.home,
  //   data: {
  //     name: 'Ryan Zimmerman',
  //     organization: 'Talus Analytics',
  //     researcherID: 'eb0c3f170f9649ef9cc6bfe656c5aa15',
  //     email: 'rzimmerman@talusanalytics.com',
  //   },
  // }

  const response = await fetch(`${process.env.GATSBY_API_URL}/auth`, {
    method: 'POST',
    body: `{"researcherID":"${researcherID}"}`,
  }).catch(error => console.log(error))

  console.log(response)
  if (!response)
    return {
      status: UserStatus.authError,
      statusMessage: 'Authentication Error',
    }

  if (response.status == 403)
    return { status: UserStatus.invalidUser, statusMessage: 'User not found' }

  if (!response.ok)
    return {
      status: UserStatus.authError,
      statusMessage: 'Authentication Error',
    }

  const data = await response.json()

  const user = {
    status: UserStatus.loggedIn,
    statusMessage: 'Logged In',
    view: View.home,
    data: data,
  }

  return user as User
}

export default authenticate
