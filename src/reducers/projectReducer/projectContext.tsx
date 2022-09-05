import React, { createContext, useEffect, useReducer, useState } from 'react'

import { useParams } from 'react-router-dom'

import { Project, ProjectStatus } from './types'

import projectReducer, {
  ProjectAction,
  ProjectActions,
  projectInitialValue,
} from './projectReducer'

import useUser from 'hooks/useUser'
import listDatasets from 'api/listDatasets'
import listProjects from 'api/listProjects'

type ProjectContextValue = {
  project: Project
  projectDispatch: React.Dispatch<ProjectAction>
}

interface ProjectContextProviderProps {
  children: React.ReactNode
}

enum ProjectsObjStatus {
  'Initial',
  'Loading',
  'Loaded',
  'Error',
}

export const ProjectContext = createContext<ProjectContextValue | null>(null)

const ProjectContextProvider = ({ children }: ProjectContextProviderProps) => {
  const user = useUser()
  const researcherID = user.data?.researcherID
  const { projectID } = useParams()

  const [projectsObj, setProjectsObj] = useState<{ [key: string]: Project }>({})

  const [projectsObjStatus, setProjectsObjStatus] = useState(
    ProjectsObjStatus.Initial
  )

  const [project, projectDispatch] = useReducer(
    projectReducer,
    projectInitialValue
  )

  // any time the user ID changes, update the Project automatically
  useEffect(() => {
    const getDatasetList = async () => {
      if (!researcherID) return null

      const nextProjects = projectsObj

      if (
        projectsObjStatus === ProjectsObjStatus.Initial &&
        Object.keys(nextProjects).length === 0
      ) {
        if (user.data?.projectIDs && user.data.projectIDs.length > 0) {
          setProjectsObjStatus(ProjectsObjStatus.Loading)
          console.log('API CALL: listProjects')
          const response = await listProjects(researcherID)
          if (response) {
            setProjectsObjStatus(ProjectsObjStatus.Loaded)
            for (const project of response) {
              nextProjects[project.projectID] = project
            }
            setProjectsObj({ ...nextProjects })
          }
        }
      }

      if (!projectID) return null

      if (
        !nextProjects[projectID] &&
        projectsObjStatus !== ProjectsObjStatus.Loading
      ) {
        if (user.data?.projectIDs && user.data.projectIDs.length > 0) {
          setProjectsObjStatus(ProjectsObjStatus.Loading)
          console.log('API CALL: listProjects')
          const response = await listProjects(researcherID)
          if (response) {
            setProjectsObjStatus(ProjectsObjStatus.Loaded)
            for (const project of response) {
              nextProjects[project.projectID] = project
            }
            setProjectsObj({ ...nextProjects })
          }
        }
      }

      projectDispatch({
        type: ProjectActions.SetProject,
        payload: { ...nextProjects[projectID] },
      })

      // set status to loading
      projectDispatch({
        type: ProjectActions.SetProjectStatus,
        payload: ProjectStatus.Loading,
      })

      // api request
      console.log('API CALL: list datasets')
      const datasets = await listDatasets(researcherID, projectID)

      if (!datasets) {
        projectDispatch({
          type: ProjectActions.SetProjectStatus,
          payload: ProjectStatus.Error,
        })
        return null
      }

      if (Object.keys(datasets).length === 0) {
        projectDispatch({
          type: ProjectActions.SetProjectStatus,
          payload: ProjectStatus.Loaded,
        })
        return null
      }

      // object to contain the datasets
      const projectObj: Project = {
        ...(projectsObj[projectID] ?? projectInitialValue),
      }

      projectObj.datasets = datasets

      projectDispatch({
        type: ProjectActions.SetProject,
        payload: { ...projectObj, status: ProjectStatus.Loaded },
      })
    }

    getDatasetList()
  }, [
    researcherID,
    projectID,
    projectsObj,
    projectsObjStatus,
    user.data?.projectIDs,
  ])

  return (
    <ProjectContext.Provider value={{ project, projectDispatch }}>
      {children}
    </ProjectContext.Provider>
  )
}

export default ProjectContextProvider
