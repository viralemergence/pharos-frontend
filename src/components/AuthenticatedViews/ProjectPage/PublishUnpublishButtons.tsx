import React, { useEffect, useRef } from 'react'

import { StateActions } from 'reducers/stateReducer/stateReducer'
import { NodeStatus, ProjectPublishStatus } from 'reducers/stateReducer/types'

import MintButton from 'components/ui/MintButton'

import useProject from 'hooks/project/useProject'
import useDispatch from 'hooks/useDispatch'
import useModal from 'hooks/useModal/useModal'
import useUser from 'hooks/useUser'
import styled from 'styled-components'

const ButtonContainer = styled.div`
  display: flex;
  gap: 5px;
`

const PublishUnpublishButtons = () => {
  const user = useUser()
  const project = useProject()
  const dispatch = useDispatch()
  const setModal = useModal()

  // if the project is in "Publishing" status, poll for updates
  const { publishStatus } = project
  // useRef to prevent starting multiple pollers
  const publishingPoller = useRef<NodeJS.Timeout | null>(null)

  const [requestedPublishing, setRequestedPublishing] = React.useState(false)
  const [unPublishing, setUnPublishing] = React.useState(false)

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
    setRequestedPublishing(true)

    try {
      const response = await fetch(
        `${process.env.GATSBY_API_URL}/publish-project`,
        {
          method: 'POST',
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
            {project.name} Publishing Error
            {JSON.stringify(json, null, 4)}
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
          {project.name} Publishing Error
          {JSON.stringify(e, null, 4)}
        </pre>,
        { closeable: true }
      )
    }
  }

  const unpublish = async () => {
    setUnPublishing(true)

    setModal(<pre style={{ margin: 40 }}>Unpublishing project...</pre>, {
      closeable: true,
    })

    const response = await fetch(
      `${process.env.GATSBY_API_URL}/unpublish-project`,
      {
        method: 'POST',
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

  let publishButton: React.ReactNode
  if (requestedPublishing) {
    publishButton = (
      <MintButton disabled inProgress>
        Loading...
      </MintButton>
    )
  } else {
    switch (project.publishStatus) {
      case ProjectPublishStatus.Unpublished:
        publishButton = <MintButton onClick={publish}>Publish</MintButton>
        break
      case ProjectPublishStatus.Published:
        publishButton = <MintButton disabled>Publish</MintButton>
        break
      case ProjectPublishStatus.Publishing:
        publishButton = (
          <MintButton disabled inProgress>
            Publishing...
          </MintButton>
        )
        break
      default:
        publishButton = <MintButton disabled>Unknown status</MintButton>
    }
  }

  return (
    <ButtonContainer>
      {publishButton}
      <MintButton
        warning
        onClick={unpublish}
        inProgress={unPublishing}
        disabled={
          [
            ProjectPublishStatus.Unpublished,
            ProjectPublishStatus.Publishing,
          ].includes(project.publishStatus) || unPublishing
        }
      >
        {unPublishing ? 'Unpublishing...' : 'Unpublish'}
      </MintButton>
    </ButtonContainer>
  )
}

export default PublishUnpublishButtons
