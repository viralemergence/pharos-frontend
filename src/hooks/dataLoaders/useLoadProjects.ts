import { useEffect } from 'react'
import localforage from 'localforage'
import 'localforage-getitems'

import { StateActions } from 'reducers/projectReducer/stateReducer'
import { NodeStatus, Project } from 'reducers/projectReducer/types'

import useUser from 'hooks/useUser'
import useDispatch from '../useDispatch'
import useAppState from 'hooks/useAppState'

const useLoadProjects = () => {
  const user = useUser()
  const dispatch = useDispatch()

  const {
    projects: { status },
  } = useAppState()

  useEffect(() => {
    const loadProjects = async () => {
      // skip loading if
      if (
        // if the user has no data
        !user.data ||
        // if the user has no projects associated
        !user.data.projectIDs ||
        user.data.projectIDs?.length === 0 ||
        // if we're already already trying to load this
        status === NodeStatus.Loading ||
        // if we're already did load this
        status === NodeStatus.Loaded
      )
        return

      dispatch({
        type: StateActions.SetAppStateStatus,
        payload: {
          key: 'projects',
          status: NodeStatus.Loading,
        },
      })

      // check local storage for projects
      const localProjects = (await localforage.getItems(
        user.data.projectIDs
      )) as {
        [key: string]: Project
      } | null

      if (localProjects) {
        dispatch({
          type: StateActions.UpdateProjects,
          payload: {
            source: 'local',
            projects: localProjects,
          },
        })
      }

      // if we're offline, we're done
      if (status === NodeStatus.Offline) return

      console.log('[API]     Request:  /list-projects')
      // otherwise, request and sync projects from remote
      const response = await fetch(
        `${process.env.GATSBY_API_URL}/list-projects`,
        {
          method: 'post',
          body: JSON.stringify({ researcherID: user.data.researcherID }),
        }
      ).catch(() => {
        // catch network error and go into offline mode
        dispatch({
          type: StateActions.SetAppStateStatus,
          payload: {
            key: 'projects',
            status: NodeStatus.Offline,
          },
        })
      })

      console.log(`[API]     Response: /list-projects: ${response?.status}`)

      if (!response || !response.ok) {
        dispatch({
          type: StateActions.SetAppStateStatus,
          payload: {
            key: 'projects',
            status: NodeStatus.Offline,
          },
        })
        return
      }

      const remoteProjectList = (await response.json()) as Project[]

      if (remoteProjectList) {
        const remoteProjects = {} as { [key: string]: Project }

        for (const project of remoteProjectList)
          remoteProjects[project.projectID] = project

        dispatch({
          type: StateActions.UpdateProjects,
          payload: {
            source: 'remote',
            projects: remoteProjects,
          },
        })

        dispatch({
          type: StateActions.SetAppStateStatus,
          payload: {
            key: 'projects',
            status: NodeStatus.Loaded,
          },
        })
      }
    }
    loadProjects()
  }, [user, status, dispatch])
}

export default useLoadProjects
