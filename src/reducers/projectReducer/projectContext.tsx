import React, { createContext, useEffect, useReducer } from 'react'

import { Dataset, Project, ProjectStatus, DatasetStatus } from './types'

import projectReducer, {
  ProjectAction,
  ProjectActions,
  projectInitialValue,
} from './projectReducer'

import useUser from 'hooks/useUser'

type ProjectContextValue = [Project, React.Dispatch<ProjectAction>]

interface ProjectContextProviderProps {
  children: React.ReactNode
}

export const ProjectContext = createContext<ProjectContextValue | null>(null)

const ProjectContextProvider = ({ children }: ProjectContextProviderProps) => {
  const [user] = useUser()
  const researcherID = user.data?.researcherID

  const [project, projectDispatch] = useReducer(
    projectReducer,
    projectInitialValue
  )

  // any time the user ID changes, update the Project automatically
  useEffect(() => {
    const getDatasetList = async (researcherID: string) => {
      // set status to loading
      projectDispatch({
        type: ProjectActions.SetStatus,
        payload: ProjectStatus.Loading,
      })

      // api request
      const response = await fetch(
        `${process.env.GATSBY_API_URL}/list-datasets`,
        {
          method: 'POST',
          body: `{"researcherID":"${researcherID}"}`,
        }
      ).catch(() => {
        projectDispatch({
          type: ProjectActions.SetStatus,
          payload: ProjectStatus.NetworkError,
        })
      })

      if (!response) {
        projectDispatch({
          type: ProjectActions.SetStatus,
          payload: ProjectStatus.NetworkError,
        })
        return undefined
      }

      // get list of datasets from json
      const { datasets: datasetList } = await response.json()

      // object to contain the datasets
      const projectObj: Project = { ...projectInitialValue }

      // insert the datasets by key
      datasetList.forEach((dataset: Dataset) => {
        if (!dataset.datasetID) throw new Error('Dataset missing datasetID')
        // set status to saved, because if it's coming from the
        // server than it must be saved on the server by definition
        projectObj.datasets[dataset.datasetID] = {
          ...dataset,
          status: DatasetStatus.Saved,
        }
      })

      projectDispatch({
        type: ProjectActions.SetProject,
        payload: projectObj,
      })

      projectDispatch({
        type: ProjectActions.SetStatus,
        payload: ProjectStatus.Loaded,
      })
    }

    if (researcherID) getDatasetList(researcherID)
  }, [researcherID])

  return (
    <ProjectContext.Provider value={[project, projectDispatch]}>
      {children}
    </ProjectContext.Provider>
  )
}

export default ProjectContextProvider
