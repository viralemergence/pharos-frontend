import { Auth } from 'aws-amplify'
import useDispatch from 'hooks/useDispatch'
import { useNavigate } from 'react-router-dom'
import { StateActions } from 'reducers/stateReducer/stateReducer'
import { User, UserStatus } from 'reducers/stateReducer/types'

const useAuthenticate = (
  setFormMessage: React.Dispatch<React.SetStateAction<string>>
) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const authenticate = async (email: string, password: string) => {
    let Authorization: string
    let userSub: string

    try {
      await Auth.signIn(email, password)

      const session = await Auth.currentSession()
      Authorization = session.getIdToken().getJwtToken()
      const currentUser = await Auth.currentUserInfo()
      userSub = currentUser.attributes.sub
    } catch (error) {
      console.error({ error })
      console.log('error signing in', error)
      return false
    }

    try {
      const response = await fetch(`${process.env.GATSBY_API_URL}/auth`, {
        method: 'POST',
        headers: new Headers({
          Authorization,
          'Content-Type': 'application/json',
        }),
        body: `{"researcherID":"res${userSub}"}`,
      })

      console.log({ response })

      const user = await response.json()

      if (!response.ok) {
        setFormMessage('Eror loading user information')
        Auth.signOut()
        return false
      }

      console.log({ user })

      dispatch({
        type: StateActions.SetUserStatus,
        payload: {
          status: UserStatus.LoggedIn,
        },
      })

      dispatch({
        type: StateActions.UpdateUser,
        payload: {
          source: 'remote',
          user: user as User,
        },
      })

      return true
    } catch (error) {
      console.error({ error })
      setFormMessage('Error loading user information.')
      return false
    }

    // const accessToken = cognitoUserSession.getAccessToken()
    // const cognitoUsername = accessToken.payload.username
  }

  //     const cognitoUserSession = (await cognitoAuthenticate(
  //       email,
  //       password
  //     )) as CognitoUserSession

  //     const accessToken = cognitoUserSession.getAccessToken()
  //     const cognitoUsername = accessToken.payload.username

  //     const response = await fetch(`${process.env.GATSBY_API_URL}/auth`, {
  //       method: 'POST',
  //       headers: new Headers({
  //         Authorization: cognitoUserSession.getIdToken().getJwtToken(),
  //         'Content-Type': 'application/json',
  //       }),
  //       body: `{"researcherID":"res${cognitoUsername}"}`,
  //     }).catch(error => {
  //       console.log({ error })
  //       setFormMessage('Error loading user.')
  //       dispatch({
  //         type: StateActions.SetUserStatus,
  //         payload: {
  //           status: UserStatus.AuthError,
  //           statusMessage: 'Error loading user.',
  //         },
  //       })
  //     })

  //     if (!response) {
  //       setFormMessage('Error loading user.')
  //       dispatch({
  //         type: StateActions.SetUserStatus,
  //         payload: {
  //           status: UserStatus.AuthError,
  //           statusMessage: 'Error loading user.',
  //         },
  //       })
  //       return false
  //     }

  //     if (response.status == 403) {
  //       setFormMessage('Invalid user.')
  //       dispatch({
  //         type: StateActions.SetUserStatus,
  //         payload: {
  //           status: UserStatus.InvalidUser,
  //           statusMessage: 'Invalid user.',
  //         },
  //       })
  //       return false
  //     }

  //     if (!response.ok) {
  //       setFormMessage('Error loading user.')
  //       dispatch({
  //         type: StateActions.SetUserStatus,
  //         payload: {
  //           status: UserStatus.AuthError,
  //           statusMessage: 'Error loading user.',
  //         },
  //       })
  //       return false
  //     }

  //     const user = (await response.json()) as User

  //     dispatch({
  //       type: StateActions.SetUserStatus,
  //       payload: {
  //         status: UserStatus.LoggedIn,
  //       },
  //     })

  //     dispatch({
  //       type: StateActions.UpdateUser,
  //       payload: {
  //         source: 'remote',
  //         user,
  //       },
  //     })

  //     return true
  //   } catch (error) {
  //     const { result } = error as { result: { message: string; name: string } }
  //     const statusMessage = result.message

  //     if (result.name === 'UserNotConfirmedException') {
  //       setFormMessage('Please check your email for a confirmation code.')
  //       dispatch({
  //         type: StateActions.SetUserStatus,
  //         payload: {
  //           status: UserStatus.AwaitingConfirmation,
  //           statusMessage: 'Please check your email for a confirmation code.',
  //         },
  //       })
  //       navigate('/sign-up/')
  //     } else {
  //       setFormMessage(statusMessage)
  //       dispatch({
  //         type: StateActions.SetUserStatus,
  //         payload: { status: UserStatus.AuthError, statusMessage },
  //       })
  //     }
  //     return false
  //   }
  // }

  return authenticate
}

export default useAuthenticate
