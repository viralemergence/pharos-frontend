import useUser from 'hooks/useUser'

import { FormData } from 'components/AuthenticatedViews/PortfolioPage/CreateProjectForm/CreateProjectForm'
import { ProjectPublishStatus, ProjectStatus } from '../types'
import { StateActions } from '../stateReducer'

import { useNavigate } from 'react-router-dom'
import useDispatch from 'hooks/useDispatch'

import generateID from 'utilities/generateID'

const useDoCreateProject = () => {
  const user = useUser()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const doCreateProject = async (formData: FormData) => {
    const projectID = generateID.projectID()

    const projectData = {
      ...formData,
      status: ProjectStatus.Saving,
      projectID,
      authors: [
        {
          researcherID: user.researcherID,
          role: 'owner',
        },
      ],
      datasetIDs: [],
      lastUpdated: new Date().toUTCString(),
      publishStatus: ProjectPublishStatus.Unpublished,
    }

    dispatch({
      type: StateActions.CreateProject,
      payload: projectData,
    })

    navigate(`/projects/${projectID}`)
  }

  return doCreateProject
}

export default useDoCreateProject
