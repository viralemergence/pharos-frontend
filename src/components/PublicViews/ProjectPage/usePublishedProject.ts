import useProjectID from 'hooks/project/useProjectID'
import { useEffect, useState } from 'react'

export interface PublishedDataset {
  projectID: string
  datasetID: string
  name: string
  lastUpdated: string
}

export interface PublishedProject {
  projectID: string
  name: string
  datePublished: string
  description?: string
  projectType?: string
  surveillanceStatus?: string
  citation?: string
  relatedMaterials?: string[]
  projectPublications?: string[]
  othersCiting?: string[]
  datasets: PublishedDataset[]
  authors: {
    researcherID: string
    name: string
    organization: string
  }[]
}

interface PublishedProjectData {
  project: PublishedProject
}

function projectIsPublishedProjectData(
  projectData: unknown
): projectData is PublishedProjectData {
  if (typeof projectData !== 'object' || projectData === null) return false
  if (!('project' in projectData)) return false

  const project = projectData.project
  if (typeof project !== 'object' || project === null) return false

  if (typeof (project as PublishedProject).projectID !== 'string') return false
  if (typeof (project as PublishedProject).name !== 'string') return false
  if (typeof (project as PublishedProject).datePublished !== 'string')
    return false

  if (
    typeof (project as PublishedProject).description !== 'string' &&
    typeof (project as PublishedProject).description !== 'undefined'
  )
    return false
  if (
    (project as PublishedProject).projectType &&
    typeof (project as PublishedProject).projectType !== 'string'
  )
    return false
  if (
    (project as PublishedProject).surveillanceStatus &&
    typeof (project as PublishedProject).surveillanceStatus !== 'string'
  )
    return false
  if (
    (project as PublishedProject).citation &&
    typeof (project as PublishedProject).citation !== 'string'
  )
    return false
  if (
    (project as PublishedProject).relatedMaterials &&
    !Array.isArray((project as PublishedProject).relatedMaterials)
  )
    return false
  if (
    (project as PublishedProject).projectPublications &&
    !Array.isArray((project as PublishedProject).projectPublications)
  )
    return false
  if (
    (project as PublishedProject).othersCiting &&
    !Array.isArray((project as PublishedProject).othersCiting)
  )
    return false
  if (
    !Array.isArray((project as PublishedProject).datasets) ||
    (project as PublishedProject).datasets === null
  )
    return false
  if (
    !Array.isArray((project as PublishedProject).authors) ||
    (project as PublishedProject).authors === null
  )
    return false
  return true
}

export enum ProjectDataStatus {
  Loading,
  Loaded,
  Error,
}
interface ProjectDataLoading {
  status: ProjectDataStatus.Loading
  data: {
    projectID: string
  }
}
interface ProjectDataLoaded {
  status: ProjectDataStatus.Loaded
  data: PublishedProject
}
interface ProjectDataError {
  status: ProjectDataStatus.Error
  data: {
    projectID: string
    error: Error
  }
}
type ProjectData = ProjectDataLoading | ProjectDataLoaded | ProjectDataError

interface ErrorWithMessage {
  message: string
}

const loadPublishedProject = async (
  projectID: string,
  setProjectData: React.Dispatch<ProjectData>
) => {
  const params = new URLSearchParams()
  params.append('projectID', projectID)

  const response = await fetch(
    `${process.env.GATSBY_API_URL}/published-project/?${params.toString()}`
  ).catch(error => {
    console.log('ERROR IN FETCH')
    setProjectData({
      status: ProjectDataStatus.Error,
      data: { projectID, error },
    })
  })

  if (!response) {
    setProjectData({
      status: ProjectDataStatus.Error,
      data: { projectID, error: new Error('No Response') },
    })
    return
  }

  if (!response.ok) {
    console.log(response)
    const message = (await response.json()) as ErrorWithMessage
    console.log(message)
    setProjectData({
      status: ProjectDataStatus.Error,
      data: {
        projectID,
        error: new Error(`Status: ${response.status}; ${message.message}`),
      },
    })
    return
  }

  const projectData = await response.json()

  if (projectIsPublishedProjectData(projectData))
    setProjectData({
      status: ProjectDataStatus.Loaded,
      data: projectData.project,
    })
  else
    setProjectData({
      status: ProjectDataStatus.Error,
      data: { projectID, error: new Error('Invalid Project Data') },
    })
}

const usePublishedProject = () => {
  const projectID = useProjectID()

  const [projectData, setProjectData] = useState<ProjectData>({
    status: ProjectDataStatus.Loading,
    data: {
      projectID,
    },
  })

  useEffect(() => {
    setProjectData({
      status: ProjectDataStatus.Loading,
      data: { projectID },
    })
    loadPublishedProject(projectID, setProjectData)
  }, [projectID])

  return projectData
}

export default usePublishedProject
