import useAppState from 'hooks/useAppState'

const useProjects = () => {
  const {
    projects: { data },
  } = useAppState()

  return data
}

export default useProjects
