import saveProject from 'api/saveProject'
import useState from 'hooks/project/useProject'
import useDispatch from 'hooks/useDispatch'
import useUser from 'hooks/useUser'
import { ProjectActions } from '../../projectReducer'
import { ProjectStatus } from '../../types'

const useDoSaveProject = () => {
  const user = useUser()
  const project = useState()
  const projectDispatch = useDispatch()

  const doSaveProject = async () => {
    console.log('Do Action: Save Project')
    if (!user.data?.researcherID) throw new Error('Researcher ID undefined')

    console.log({ project })

    projectDispatch({
      type: ProjectActions.SetProjectStatus,
      payload: ProjectStatus.Saving,
    })

    const projectSaveData = { ...project }
    // don't save datasets object to the server
    projectSaveData.datasets = {}
    // set project status to saved in the version sent to server
    projectSaveData.status = ProjectStatus.Saved

    const saved = await saveProject(projectSaveData)

    if (saved)
      projectDispatch({
        type: ProjectActions.SetProjectStatus,
        payload: ProjectStatus.Saved,
      })
    else
      projectDispatch({
        type: ProjectActions.SetProjectStatus,
        payload: ProjectStatus.Error,
      })
  }

  return doSaveProject
}

export default useDoSaveProject
