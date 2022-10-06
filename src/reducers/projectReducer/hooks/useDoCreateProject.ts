import useUser from 'hooks/useUser'

import { FormData } from 'components/AuthenticatedViews/PortfolioPage/CreateProjectForm/CreateProjectForm'
import { NodeStatus, ProjectPublishStatus, ProjectStatus } from '../types'
import generateID from 'utilities/generateID'
import useDispatch from 'hooks/useDispatch'
import { ProjectActions } from '../projectReducer'
import { useNavigate } from 'react-router-dom'

const useDoCreateProject = () => {
  const user = useUser()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const doCreateProject = async (formData: FormData) => {
    if (!user.data?.researcherID) throw new Error('Researcher ID undefined')

    const projectID = generateID.projectID()

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

    dispatch({
      type: ProjectActions.CreateProject,
      payload: projectData,
    })

    navigate(`/projects/${projectID}`)
  }

  return doCreateProject
}

export default useDoCreateProject
