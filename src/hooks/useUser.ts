import useAppState from './useAppState'

const useUser = () => {
  const {
    user: { data: user },
  } = useAppState()

  if (!user) throw new Error('User not logged in')

  return user
}

export default useUser
