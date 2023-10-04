import { AuthenticationDetails, CognitoUser } from 'amazon-cognito-identity-js'
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
        return resolve({
          success: true,
          message: 'Logged in',
          result,
        } as AuthenticationResult)
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

    try {
      const cognitoUser = await cognitoAuthenticate(email, password)

      console.log(cognitoUser)

      const response = await fetch(`${process.env.GATSBY_API_URL}/auth`, {
        method: 'POST',
        body: `{"researcherID":"res${cognitoUser.result.idToken.payload.username}"}`,
      }).catch(error => console.log(error))

      if (!response) {
        dispatch({
          type: StateActions.SetUserStatus,
          payload: {
            status: UserStatus.AuthError,
          },
        })
        return false
      }

      if (response.status == 403) {
        dispatch({
          type: StateActions.SetUserStatus,
          payload: {
            status: UserStatus.InvalidUser,
          },
        })
        return false
      }

      if (!response.ok) {
        dispatch({
          type: StateActions.SetUserStatus,
          payload: {
            status: UserStatus.AuthError,
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
