import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserSession,
} from 'amazon-cognito-identity-js'
import useDispatch from 'hooks/useDispatch'
import { useNavigate } from 'react-router-dom'
import { StateActions } from 'reducers/stateReducer/stateReducer'
import { User, UserStatus } from 'reducers/stateReducer/types'
import userpool from '../userpool'

interface AuthenticationResult {
  success: boolean
  message: string
  result: unknown
}

const cognitoAuthenticate = async (email: string, password: string) => {
  const user = new CognitoUser({
    Username: email,
    Pool: userpool,
  })

  const authDetails = new AuthenticationDetails({
    Username: email,
    Password: password,
  })

  return new Promise((resolve, reject) =>
    user.authenticateUser(authDetails, {
      onSuccess: result => {
        return resolve(result)
      },
      onFailure: error => {
        return reject({
          success: false,
          message: error.message,
          result: error,
        } as AuthenticationResult)
      },
    })
  )
}

const useAuthenticate = (
  setFormMessage: React.Dispatch<React.SetStateAction<string>>
) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const authenticate = async (email: string, password: string) => {
    try {
      const cognitoUserSession = (await cognitoAuthenticate(
        email,
        password
      )) as CognitoUserSession

      const accessToken = cognitoUserSession.getAccessToken()
      const cognitoUsername = accessToken.payload.username

      const response = await fetch(`${process.env.GATSBY_API_URL}/auth`, {
        method: 'POST',
        headers: new Headers({
          Authorization: cognitoUserSession.getIdToken().getJwtToken(),
          'Content-Type': 'application/json',
        }),
        body: `{"researcherID":"res${cognitoUsername}"}`,
      }).catch(error => {
        console.log({ error })
        setFormMessage('Error loading user.')
        dispatch({
          type: StateActions.SetUserStatus,
          payload: {
            status: UserStatus.AuthError,
            statusMessage: 'Error loading user.',
          },
        })
      })

      if (!response) {
        setFormMessage('Error loading user.')
        dispatch({
          type: StateActions.SetUserStatus,
          payload: {
            status: UserStatus.AuthError,
            statusMessage: 'Error loading user.',
          },
        })
        return false
      }

      if (response.status == 403) {
        setFormMessage('Invalid user.')
        dispatch({
          type: StateActions.SetUserStatus,
          payload: {
            status: UserStatus.InvalidUser,
            statusMessage: 'Invalid user.',
          },
        })
        return false
      }

      if (!response.ok) {
        setFormMessage('Error loading user.')
        dispatch({
          type: StateActions.SetUserStatus,
          payload: {
            status: UserStatus.AuthError,
            statusMessage: 'Error loading user.',
          },
        })
        return false
      }

      const user = (await response.json()) as User

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
          user,
        },
      })

      return true
    } catch (error) {
      const { result } = error as { result: { message: string; name: string } }
      const statusMessage = result.message

      if (result.name === 'UserNotConfirmedException') {
        setFormMessage('Please check your email for a confirmation code.')
        dispatch({
          type: StateActions.SetUserStatus,
          payload: {
            status: UserStatus.AwaitingConfirmation,
            statusMessage: 'Please check your email for a confirmation code.',
          },
        })
        navigate('/sign-up/')
      } else {
        setFormMessage(statusMessage)
        dispatch({
          type: StateActions.SetUserStatus,
          payload: { status: UserStatus.AuthError, statusMessage },
        })
      }
      return false
    }
  }

  return authenticate
}

export default useAuthenticate
