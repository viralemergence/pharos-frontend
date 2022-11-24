import useAppState from './useAppState'

const useUser = () => {
  const {
    user: { data: user },
  } = useAppState()

  return user
}

export default useUser
