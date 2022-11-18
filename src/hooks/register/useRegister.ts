import useAppState from 'hooks/useAppState'

const useRegister = () => {
  const {
    register: { data },
  } = useAppState()

  return data
}

export default useRegister
