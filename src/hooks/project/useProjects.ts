import { useEffect } from 'react'
import localforage from 'localforage'
import 'localforage-getitems'

import { ProjectActions } from 'reducers/projectReducer/projectReducer'
import { NodeStatus, Project } from 'reducers/projectReducer/types'

import useUser from 'hooks/useUser'
import useAppState from './useProject'
import useDispatch from './useProjectDispatch'

import listProjects from 'api/listProjects'

const useProjects = () => {
  const user = useUser()

  const { status, projects } = useAppState()
  const dispatch = useDispatch()

  useEffect(() => {
    const loadProjects = async () => {
      // skip loading if
      if (
        // if the user has no data
        !user.data ||
        // if the user has no projects associated
        !user.data.projectIDs ||
        user.data.projectIDs?.length === 0 ||
        // if we're already already trying to sync this data
        status === NodeStatus.Syncing ||
        status === NodeStatus.Loading ||
        // if we already tried to load exactly this
        status === NodeStatus.Synced
      )
        return

      // check local storage for projects
      const localProjects = (await localforage.getItems(
        user.data.projectIDs
      )) as {
        [key: string]: Project
      }

      console.log({ localProjects })

      if (localProjects) {
        dispatch({
          type: ProjectActions.UpdateProjects,
          payload: {
            source: 'local',
            projects: localProjects,
          },
        })
      }

      dispatch({
        type: ProjectActions.SetAppStateStatus,
        payload: NodeStatus.Loading,
      })

      // if we're offline, we're done
      if (status === NodeStatus.Offline) return

      // otherwise, request and sync projects from remote
      const response = await fetch(
        `${process.env.GATSBY_API_URL}/list-projects`,
        {
          method: 'post',
          body: JSON.stringify({ researcherID: user.data.researcherID }),
        }
      ).catch(error => {
        // catch network error and go into offline mode
        dispatch({
          type: ProjectActions.SetAppStateStatus,
          payload: NodeStatus.Offline,
        })
      })

      if (!response || !response.ok) {
        dispatch({
          type: ProjectActions.SetAppStateStatus,
          payload: NodeStatus.Offline,
        })
        return
      }

      const remoteProjectList = (await response.json()) as Project[]

      if (remoteProjectList) {
        const remoteProjects = {} as { [key: string]: Project }

        for (const project of remoteProjectList)
          remoteProjects[project.projectID] = project

        dispatch({
          type: ProjectActions.UpdateProjects,
          payload: {
            source: 'remote',
            projects: remoteProjects,
          },
        })

        dispatch({
          type: ProjectActions.SetAppStateStatus,
          payload: NodeStatus.Syncing,
        })
      }
    }

    loadProjects()
  }, [user, status, projects, dispatch])

  return projects
}

export default useProjects
