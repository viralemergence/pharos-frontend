import React, { createContext, useEffect, useReducer, useState } from 'react'

import { AppState, NodeStatus, APIRoute } from './types'

import projectReducer, {
  ProjectAction,
  stateInitialValue,
} from './projectReducer'

import localSaveProject from 'storage/local/localSaveProject'

type ProjectContextValue = {
  state: AppState
  dispatch: React.Dispatch<ProjectAction>
}

interface ProjectContextProviderProps {
  children: React.ReactNode
}

export const ProjectContext = createContext<ProjectContextValue | null>(null)

const StateContextProvider = ({ children }: ProjectContextProviderProps) => {
  const [state, dispatch] = useReducer(projectReducer, stateInitialValue)

  const status = state.status
  const storageQueue = state.storageQueue

  useEffect(() => {
    if (status === NodeStatus.Syncing) {
      console.log('storageQueue needs to be handled')
      console.log({ queue: [...storageQueue] })
      for (const message of storageQueue) {
        switch (message.route) {
          case APIRoute.saveProject:
            if (message.target == 'local') localSaveProject(message.data)
            else console.log('need to handle server save project')
        }
      }
    }
  }, [storageQueue, status])

  // // any time the user ID changes, update the Project automatically
  // useEffect(() => {
  //   if (!researcherID) return null

  //   const getDatasetList = async () => {
  //     if (!researcherID) return null

  //     const nextProjects = projectsObj

  //     if (
  //       projectsObjStatus === ProjectsObjStatus.Initial &&
  //       Object.keys(nextProjects).length === 0
  //     ) {
  //       if (user.data?.projectIDs && user.data.projectIDs.length > 0) {
  //         setProjectsObjStatus(ProjectsObjStatus.Loading)
  //         console.log('API CALL: listProjects')
  //         const response = await listProjects(researcherID)
  //         if (response) {
  //           setProjectsObjStatus(ProjectsObjStatus.Loaded)
  //           for (const project of response) {
  //             nextProjects[project.projectID] = project
  //           }
  //           setProjectsObj({ ...nextProjects })
  //         }
  //       }
  //     }

  //     if (!projectID) return null

  //     if (
  //       !nextProjects[projectID] &&
  //       projectsObjStatus !== ProjectsObjStatus.Loading
  //     ) {
  //       if (user.data?.projectIDs && user.data.projectIDs.length > 0) {
  //         setProjectsObjStatus(ProjectsObjStatus.Loading)
  //         console.log('API CALL: listProjects')
  //         const response = await listProjects(researcherID)
  //         if (response) {
  //           setProjectsObjStatus(ProjectsObjStatus.Loaded)
  //           for (const project of response) {
  //             nextProjects[project.projectID] = project
  //           }
  //           setProjectsObj({ ...nextProjects })
  //         }
  //       }
  //     }

  //     dispatch({
  //       type: ProjectActions.SetProject,
  //       payload: { projectID, project: { ...nextProjects[projectID] } },
  //     })

  //     // set status to loading
  //     dispatch({
  //       type: ProjectActions.SetProjectStatus,
  //       payload: {
  //         projectID,
  //         status: ProjectStatus.Loading,
  //       },
  //     })

  //     // api request
  //     console.log('API CALL: list datasets')
  //     const datasets = await listDatasets(researcherID, projectID)
  //     console.log(project.status)

  //     if (!datasets) {
  //       dispatch({
  //         type: ProjectActions.SetProjectStatus,
  //         payload: {
  //           projectID,
  //           status: ProjectStatus.Error,
  //         },
  //       })
  //       return null
  //     }

  //     dispatch({
  //       type: ProjectActions.SetProjectStatus,
  //       payload: {
  //         projectID,
  //         status: ProjectStatus.Loaded,
  //       },
  //     })

  //     if (Object.keys(datasets).length === 0) return null

  //     // object to contain the datasets
  //     const projectObj: Project = {
  //       ...(projectsObj[projectID] ?? projectInitialValue),
  //     }

  //     projectObj.datasets = datasets

  //     dispatch({
  //       type: ProjectActions.SetProject,
  //       payload: { ...projectObj, status: ProjectStatus.Loaded },
  //     })
  //   }

  //   if (
  //     project.status !== ProjectStatus.Loaded &&
  //     project.status !== ProjectStatus.Loading
  //   )
  //     getDatasetList()
  // }, [
  //   project.status,
  //   researcherID,
  //   projectID,
  //   projectsObj,
  //   projectsObjStatus,
  //   user.data?.projectIDs,
  // ])

  return (
    <ProjectContext.Provider value={{ state, dispatch }}>
      {children}
    </ProjectContext.Provider>
  )
}

export default StateContextProvider
