import useProjectID from 'hooks/project/useProjectID'

interface PublishedProject {
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
  publishStatus: ProjectPublishStatus
  datasets: {
    datasetID: string
    name: string
  }[]
  authors: {
    researcherID: string
    name: string
    organization: string
  }[]
}

const usePublishedProject = () => {
  const projectID = useProjectID()

  const project: PublishedProject = {
    projectID,
    name: 'offline mock project',
    datePublished: '1-1-2023',
    description: 'offline mock project description text placeholder',
    projectType: 'Opportunistic',
    surveillanceStatus: 'Complete',
    citation: 'Developer et. al.',
    datasets: [
      {
        datasetID: 'datXXXXXXXXX',
        name: 'mock dataset',
      },
    ],
    authors: [
      {
        researcherID: 'resdev',
        name: 'Developer',
        organization: 'Georgetown University',
      },
    ],
  }

  return project
}
