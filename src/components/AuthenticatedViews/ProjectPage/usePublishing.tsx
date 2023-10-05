import React, { useEffect, useRef, useState } from 'react'

import useUser from 'hooks/useUser'
import useModal from 'hooks/useModal/useModal'
import useProject from 'hooks/project/useProject'
import useDispatch from 'hooks/useDispatch'

import { StateActions } from 'reducers/stateReducer/stateReducer'
import { NodeStatus, ProjectPublishStatus } from 'reducers/stateReducer/types'
import { getCognitoSession } from 'components/Authentication/useUserSession'

const usePublishing = () => {
  const user = useUser()
  const project = useProject()
  const dispatch = useDispatch()
  const setModal = useModal()

  // if the project is in "Publishing" status, poll for updates
  const { publishStatus } = project
  // useRef to prevent starting multiple pollers
  const publishingPoller = useRef<NodeJS.Timeout | null>(null)

  const [requestedPublishing, setRequestedPublishing] = useState(false)
  const [unPublishing, setUnPublishing] = useState(false)

  useEffect(() => {
    const invalidateProjectsAndDatasets = () => {
      dispatch({
        type: StateActions.SetMetadataObjStatus,
        payload: {
          key: 'projects',
          status: NodeStatus.Initial,
        },
      })
      dispatch({
        type: StateActions.SetMetadataObjStatus,
        payload: {
          key: 'datasets',
          status: NodeStatus.Initial,
        },
      })

      if (publishStatus === ProjectPublishStatus.Publishing)
        publishingPoller.current = setTimeout(
          invalidateProjectsAndDatasets,
          1000
        )
    }

    if (
      !publishingPoller.current &&
      publishStatus === ProjectPublishStatus.Publishing
    ) {
      publishingPoller.current = setTimeout(invalidateProjectsAndDatasets, 1000)
    }

    return () => {
      if (publishingPoller.current) {
        clearTimeout(publishingPoller.current)
        publishingPoller.current = null
      }
    }
  }, [dispatch, publishStatus])

  const publish = async () => {
    let userSession
    try {
      userSession = await getCognitoSession()
    } catch (e) {
      console.error(e)
      return
    }

    setRequestedPublishing(true)

    try {
      const response = await fetch(
        `${process.env.GATSBY_API_URL}/publish-project`,
        {
          method: 'POST',
          headers: new Headers({
            Authorization: userSession.getIdToken().getJwtToken(),
            'Content-Type': 'application/json',
          }),
          body: JSON.stringify({
            projectID: project.projectID,
            researcherID: user.researcherID,
          }),
        }
      )

      if (!response.ok || response.status !== 200) {
        const json = await response.json()
        console.log(json)
        setRequestedPublishing(false)
        setModal(
          <pre style={{ margin: '20px' }}>
            Publishing Error {json as string}
          </pre>,
          { closeable: true }
        )
        return
      }

      dispatch({
        type: StateActions.SetProjectPublishingStatus,
        payload: {
          projectID: project.projectID,
          publishStatus: ProjectPublishStatus.Publishing,
        },
      })

      setRequestedPublishing(false)
    } catch (e) {
      console.log(e)
      setModal(
        <pre style={{ margin: '20px' }}>
          {project.name} Publishing Error {JSON.stringify(e, null, 4)}
        </pre>,
        { closeable: true }
      )
    }
  }

  const unpublish = async () => {
    let userSession
    try {
      userSession = await getCognitoSession()
    } catch (e) {
      console.error(e)
      return
    }

    setUnPublishing(true)

    setModal(<pre style={{ margin: 40 }}>Unpublishing project...</pre>, {
      closeable: true,
    })

    const response = await fetch(
      `${process.env.GATSBY_API_URL}/unpublish-project`,
      {
        method: 'POST',
        headers: new Headers({
          Authorization: userSession.getIdToken().getJwtToken(),
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify({
          projectID: project.projectID,
          researcherID: user.researcherID,
        }),
      }
    ).catch(e => {
      console.log(e)
      setModal(
        <pre style={{ margin: 20 }}>{project.name} unpublish failed</pre>
      )
    })

    dispatch({
      type: StateActions.SetMetadataObjStatus,
      payload: {
        key: 'projects',
        status: NodeStatus.Initial,
      },
    })
    dispatch({
      type: StateActions.SetMetadataObjStatus,
      payload: {
        key: 'datasets',
        status: NodeStatus.Initial,
      },
    })

    if (!response) return

    const json = await response.json()

    setUnPublishing(false)

    setModal(
      <pre style={{ margin: 20 }}>{JSON.stringify(json, null, 4)}</pre>,
      { closeable: true }
    )
  }

  return { publish, unpublish, requestedPublishing, unPublishing }
}

export default usePublishing
