import saveProject from 'api/saveProject'
import useProjectDispatch from 'hooks/project/useProjectDispatch'
import useUser from 'hooks/useUser'
import { ProjectActions } from '../projectReducer'
import { Project, ProjectStatus } from '../types'

const useDoSaveProject = () => {
  const user = useUser()
  const projectDispatch = useProjectDispatch()

  const doSaveProject = async (project: Project) => {
    console.log('Do Action: Set Project')
    if (!user.data?.researcherID) throw new Error('Researcher ID undefined')

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
