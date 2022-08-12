import React, { createContext, useEffect, useReducer, useState } from 'react'

import { Dataset, Project, ProjectStatus, DatasetStatus } from './types'

import projectReducer, {
  ProjectAction,
  ProjectActions,
  projectInitialValue,
} from './projectReducer'

import useUser from 'hooks/useUser'
import listDatasets from 'api/listDatasets'
import { useParams } from 'react-router-dom'
import listProjects from 'api/listProjects'
import useProjectDispatch from 'hooks/project/useProjectDispatch'

type ProjectContextValue = {
  project: Project
  projectDispatch: React.Dispatch<ProjectAction>
}

interface ProjectContextProviderProps {
  children: React.ReactNode
}

export const ProjectContext = createContext<ProjectContextValue | null>(null)

const ProjectContextProvider = ({ children }: ProjectContextProviderProps) => {
  const user = useUser()
  const researcherID = user.data?.researcherID
  const { projectID } = useParams()

  const [projects, setProjects] = useState<{ [key: string]: Project }>({})

  console.log('provider called')
  console.log({ projectID })

  const [project, projectDispatch] = useReducer(
    projectReducer,
    projectInitialValue
  )

  // any time the user ID changes, update the Project automatically
  useEffect(() => {
    console.log('useEffect called')
    const getDatasetList = async () => {
      console.log('getDatsetList called')
      console.log({ projectID, researcherID })

      if (!researcherID) return null

      const nextProjects = projects

      if (Object.keys(nextProjects).length === 0) {
        console.log('API CALL: listProjects')
        if (user.data?.projects && user.data.projects.length > 0) {
          const response = await listProjects(researcherID)
          if (response) {
            for (const project of response) {
              nextProjects[project.projectID] = project
            }
          }
        }
      }

      if (!projectID) return null

      if (!nextProjects[projectID]) {
        console.log('API CALL: listProjects')
        if (user.data?.projects && user.data.projects.length > 0) {
          const response = await listProjects(researcherID)
          if (response) {
            for (const project of response) {
              nextProjects[project.projectID] = project
            }
          }
        }
      }

      projectDispatch({
        type: ProjectActions.SetProject,
        payload: { ...nextProjects[projectID] },
      })

      console.log('set status to loading')
      // set status to loading
      projectDispatch({
        type: ProjectActions.SetProjectStatus,
        payload: ProjectStatus.Loading,
      })

      // api request
      console.log('API CALL: list datasets')
      const datasetList = await listDatasets(researcherID, projectID)

      console.log(datasetList)

      if (!datasetList) {
        projectDispatch({
          type: ProjectActions.SetProjectStatus,
          payload: ProjectStatus.Error,
        })
        return null
      }

      if (datasetList.length === 0) {
        projectDispatch({
          type: ProjectActions.SetProjectStatus,
          payload: ProjectStatus.Loaded,
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
          status: DatasetStatus.Saved,
        }
      })

      projectDispatch({
        type: ProjectActions.SetProject,
        payload: { ...projectObj, status: ProjectStatus.Loaded },
      })
    }

    getDatasetList()
  }, [researcherID, projectID])

  return (
    <ProjectContext.Provider value={{ project, projectDispatch }}>
      {children}
    </ProjectContext.Provider>
  )
}

export default ProjectContextProvider
