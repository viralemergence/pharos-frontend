import useUser from 'hooks/useUser'

import { FormData } from 'components/AuthenticatedViews/PortfolioPage/CreateProjectForm/CreateProjectForm'
import { ProjectPublishStatus, ProjectStatus } from '../types'
import generateID from 'utilities/generateID'
import useDispatch from 'hooks/project/useProjectDispatch'
import { ProjectActions } from '../projectReducer'
import useDoSaveProject from './api/useDoSaveProject'
import { useNavigate } from '@reach/router'

const useDoCreateProject = () => {
  const user = useUser()
  const projectID = generateID.projectID()
  const projectDispatch = useDispatch()
  const doSaveProject = useDoSaveProject()

  const navigate = useNavigate()

  const doCreateProject = async (formData: FormData) => {
    if (!user.data?.researcherID) throw new Error('Researcher ID undefined')

    const projectData = {
      ...formData,
      status: ProjectStatus.Saving,
      projectID,
      authors: [
        {
          researcherID: user.data.researcherID,
          role: 'owner',
        },
      ],
      datasetIDs: [],
      datasets: {},
      lastUpdated: new Date().toUTCString(),
      publishStatus: ProjectPublishStatus.Unpublished,
    }

    projectDispatch({
      type: ProjectActions.SetProject,
      payload: projectData,
    })

    await doSaveProject()

    navigate(`/projects/${projectID}`)
  }

  return doCreateProject
}

export default useDoCreateProject
