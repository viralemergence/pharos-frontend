import useDispatch from 'hooks/useDispatch'
import { StateActions } from 'reducers/stateReducer/stateReducer'
import { User, UserStatus } from 'reducers/stateReducer/types'

const useAuthenticate = () => {
  const dispatch = useDispatch()

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

    if (!response) {
      dispatch({
        type: StateActions.SetUserStatus,
        payload: UserStatus.authError,
      })
      return false
    }

    if (response.status == 403) {
      dispatch({
        type: StateActions.SetUserStatus,
        payload: UserStatus.invalidUser,
      })
      return false
    }

    if (!response.ok) {
      dispatch({
        type: StateActions.SetUserStatus,
        payload: UserStatus.authError,
      })
      return false
    }

    const user = (await response.json()) as User

    dispatch({
      type: StateActions.SetUserStatus,
      payload: UserStatus.loggedIn,
    })

    dispatch({
      type: StateActions.UpdateUser,
      payload: {
        source: 'remote',
        user,
      },
    })

    return true
  }

  return authenticate
}

export default useAuthenticate
