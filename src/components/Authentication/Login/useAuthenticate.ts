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

const useAuthenticate = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const authenticate = async (email: string, password: string) => {
    try {
      const cognitoUserSession = (await cognitoAuthenticate(
        email,
        password
      )) as CognitoUserSession

      console.log(cognitoUserSession)

      const accessToken = cognitoUserSession.getAccessToken()
      const cognitoUsername = accessToken.payload.username

      console.log(cognitoUserSession.isValid())

      console.log(accessToken.getJwtToken())

      const response = await fetch(`${process.env.GATSBY_API_URL}/auth`, {
        method: 'POST',
        headers: new Headers({
          Authorization: cognitoUserSession.getIdToken().getJwtToken(),
          'Content-Type': 'application/json',
        }),
        body: `{"researcherID":"res${cognitoUsername}"}`,
      }).catch(error => {
        console.log({ error })
        dispatch({
          type: StateActions.SetUserStatus,
          payload: {
            status: UserStatus.AuthError,
            statusMessage: 'Error loading user.',
          },
        })
      })

      if (!response) {
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
      console.log(error)
      const { result } = error as { result: { message: string; name: string } }
      const statusMessage = result.message

      if (result.name === 'UserNotConfirmedException') {
        dispatch({
          type: StateActions.SetUserStatus,
          payload: {
            status: UserStatus.AwaitingConfirmation,
            statusMessage: 'Please check your email for a confirmation code.',
          },
        })
        navigate('/sign-up/')
      } else
        dispatch({
          type: StateActions.SetUserStatus,
          payload: { status: UserStatus.AuthError, statusMessage },
        })

      return false
    }

    //     const response = await fetch(`${process.env.GATSBY_API_URL}/auth`, {
    //       method: 'POST',
    //       body: `{"researcherID":"${researcherID}"}`,
    //     }).catch(error => console.log(error))

    //     if (!response) {
    //       dispatch({
    //         type: StateActions.SetUserStatus,
    //         payload: UserStatus.authError,
    //       })
    //       return false
    //     }

    //     if (response.status == 403) {
    //       dispatch({
    //         type: StateActions.SetUserStatus,
    //         payload: UserStatus.invalidUser,
    //       })
    //       return false
    //     }

    //     if (!response.ok) {
    //       dispatch({
    //         type: StateActions.SetUserStatus,
    //         payload: UserStatus.authError,
    //       })
    //       return false
    //     }

    //     const user = (await response.json()) as User

    //     dispatch({
    //       type: StateActions.SetUserStatus,
    //       payload: UserStatus.loggedIn,
    //     })

    //     dispatch({
    //       type: StateActions.UpdateUser,
    //       payload: {
    //         source: 'remote',
    //         user,
    //       },
    //     })

    // return true
  }

  return authenticate
}

export default useAuthenticate
