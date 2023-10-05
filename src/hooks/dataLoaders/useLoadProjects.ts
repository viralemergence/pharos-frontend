import { useEffect } from 'react'
import localforage from 'localforage'
import 'localforage-getitems'

import { StateActions } from 'reducers/stateReducer/stateReducer'
import { NodeStatus, Project } from 'reducers/stateReducer/types'

import useUser from 'hooks/useUser'
import useDispatch from '../useDispatch'
import useAppState from 'hooks/useAppState'
import { getCognitoSession } from 'components/Authentication/useUserSession'

const useLoadProjects = () => {
  const dispatch = useDispatch()
  const user = useUser()

  const {
    projects: { status },
  } = useAppState()

  useEffect(() => {
    const loadProjects = async () => {
      // skip loading if
      if (
        // if the user has no projects associated
        !user ||
        !user.projectIDs ||
        user.projectIDs.length === 0 ||
        // if we're already already trying to load this
        status === NodeStatus.Loading ||
        // if we're already did load this
        status === NodeStatus.Loaded
      )
        return

      let userSession
      try {
        userSession = await getCognitoSession()
      } catch (e) {
        console.error(e)
        return
      }

      dispatch({
        type: StateActions.SetMetadataObjStatus,
        payload: {
          key: 'projects',
          status: NodeStatus.Loading,
        },
      })

      // check local storage for projects
      const localProjects = (await localforage.getItems(user.projectIDs)) as {
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

      console.log(`${'[API]'.padEnd(15)} Request:  /list-projects`)
      // otherwise, request and sync projects from remote
      const response = await fetch(
        `${process.env.GATSBY_API_URL}/list-projects`,
        {
          method: 'post',
          headers: new Headers({
            Authorization: userSession.getIdToken().getJwtToken(),
            'Content-Type': 'application/json',
          }),
          body: JSON.stringify({ researcherID: user.researcherID }),
        }
      ).catch(() => {
        // catch network error and go into offline mode
        dispatch({
          type: StateActions.SetMetadataObjStatus,
          payload: {
            key: 'projects',
            status: NodeStatus.Offline,
          },
        })
      })

      console.log(
        `${'[API]'.padEnd(15)} Response: /list-projects: ${response?.status}`
      )

      if (!response || !response.ok) {
        dispatch({
          type: StateActions.SetMetadataObjStatus,
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
          type: StateActions.SetMetadataObjStatus,
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
