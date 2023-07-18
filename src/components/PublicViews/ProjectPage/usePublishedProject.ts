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
    datePublished: '2023-1-1',
    description: 'offline mock project description text placeholder',
    projectType: 'Opportunistic',
    surveillanceStatus: 'Complete',
    citation: 'Developer et. al.',
    relatedMaterials: ['https://www.github.com/viralemergence/'],
    datasets: [
      {
        datasetID: 'datXXXXXXXXX',
        name: 'mock dataset',
      },
    ],
    authors: [
      {
        researcherID: 'resreview',
        name: 'Ryan Zimmerman',
        organization: 'Georgetown University',
      },
      {
        researcherID: 'resdev',
        name: 'Developer',
        organization: 'Georgetown University',
      },
    ],
  }

  return project
}

export default usePublishedProject
