import saveProject from 'api/saveProject'
import useProjectDispatch from 'hooks/project/useProjectDispatch'
import useUser from 'hooks/useUser'
import { useEffect } from 'react'
import { ProjectActions } from 'reducers/projectReducer/projectReducer'
import { ProjectStatus } from 'reducers/projectReducer/types'
import useProject from './useProject'

const useAutosaveProject = () => {
  const projectDispatch = useProjectDispatch()
  const project = useProject()
  const user = useUser()

  useEffect(() => {
    const save = async () => {
      if (project.status !== ProjectStatus.Unsaved || !user.data?.researcherID)
        return null

      projectDispatch({
        type: ProjectActions.SetProjectStatus,
        payload: ProjectStatus.Saving,
      })

      console.log('API Sync: Save Project')
      // omit register, save everything else to the server
      const projectSaveData = { ...project }
      projectSaveData.datasets = {}
      projectSaveData.status = ProjectStatus.Saved

      console.log(projectSaveData)

      const saved = await saveProject(projectSaveData)

      if (saved) {
        projectDispatch({
          type: ProjectActions.SetProjectStatus,
          payload: ProjectStatus.Saved,
        })
      } else {
        projectDispatch({
          type: ProjectActions.SetProjectStatus,
          payload: ProjectStatus.Error,
        })
      }
    }

    save()
  }, [project, projectDispatch, user.data?.researcherID])
}

export default useAutosaveProject
