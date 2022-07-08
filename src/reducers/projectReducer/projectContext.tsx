import React, { createContext, useEffect, useReducer } from 'react'

import { Dataset, Project, ProjectStatus, DatasetStatus } from './types'

import projectReducer, {
  ProjectAction,
  ProjectActions,
  projectInitialValue,
} from './projectReducer'

import useUser from 'hooks/useUser'
import listDatasets from 'api/listDatasets'

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
      const datasetList = await listDatasets(researcherID)

      if (!datasetList) {
        projectDispatch({
          type: ProjectActions.SetStatus,
          payload: ProjectStatus.NetworkError,
        })
        return null
      }

      if (datasetList.length === 0) {
        projectDispatch({
          type: ProjectActions.SetProject,
          payload: { ...projectInitialValue, status: ProjectStatus.Loaded },
        })

        return null
      }

      // object to contain the datasets
      const projectObj: Project = { ...projectInitialValue }

      // insert the datasets by key
      datasetList.forEach((dataset: Dataset) => {
        if (!dataset.datasetID) throw new Error('Dataset missing datasetID')
        // set status to saved, because if it's coming from the
        // server than it must be saved on the server by definition
        projectObj.datasets[dataset.datasetID] = {
          ...dataset,
          // we don't have a way to save the
          // activeVersion to the server yet
          // activeVersion: Number(dataset.activeVersion),
          activeVersion: dataset.versions.length - 1,
          status: DatasetStatus.Saved,
        }
      })

      projectDispatch({
        type: ProjectActions.SetProject,
        payload: { ...projectObj, status: ProjectStatus.Loaded },
      })

      // projectDispatch({
      //   type: ProjectActions.SetStatus,
      //   payload: ProjectStatus.Loaded,
      // })
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
