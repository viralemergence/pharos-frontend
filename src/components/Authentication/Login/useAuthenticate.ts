import { Auth } from 'aws-amplify'
import useDispatch from 'hooks/useDispatch'
// import { useNavigate } from 'react-router-dom'
import { StateActions } from 'reducers/stateReducer/stateReducer'
import { User, UserStatus } from 'reducers/stateReducer/types'

const useAuthenticate = (
  setFormMessage: React.Dispatch<React.SetStateAction<string>>
) => {
  const dispatch = useDispatch()
  // TODO: add redirect to confirm email screen
  // if the user tries to sign in as an unconfirmed user
  // const navigate = useNavigate()

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
      setFormMessage((error as { message: string }).message)
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

      const user = await response.json()

      if (!response.ok) {
        setFormMessage('Eror loading user information')
        Auth.signOut()
        return false
      }

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
  }

  return authenticate
}

export default useAuthenticate
