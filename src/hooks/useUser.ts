import { useContext } from 'react'
import { UserContext } from 'components/layout/UserContext'

const useUser = () => {
  const userState = useContext(UserContext)

  if (!userState) throw new Error('User context not found')

  return userState
}

export default useUser
