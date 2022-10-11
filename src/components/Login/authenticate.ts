import { User, UserStatus } from 'reducers/projectReducer/types'
import localforage from 'localforage'

const authenticate = async (researcherID: string) => {
  // offline debugging
  // return {
  //   status: UserStatus.loggedIn,
  //   statusMessage: 'Logged in',
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
    data: data,
  }

  localforage.setItem('user', user)

  return user as User
}

export default authenticate
