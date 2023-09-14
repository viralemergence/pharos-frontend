import React from 'react'

import MintButton from 'components/ui/MintButton'

import styled from 'styled-components'
import { ProjectPublishStatus } from 'reducers/stateReducer/types'
import useProject from 'hooks/project/useProject'

const ButtonContainer = styled.div`
  display: flex;
  gap: 5px;
`

interface PublishUnpublishButtonsProps {
  publish: () => void
  requestedPublishing: boolean
}

const PublishUnpublishButtons = ({
  publish,
  requestedPublishing,
}: PublishUnpublishButtonsProps) => {
  const project = useProject()

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
      {
        // <MintButton
        //   warning
        //   onClick={unpublish}
        //   inProgress={unPublishing}
        //   disabled={
        //     [
        //       ProjectPublishStatus.Unpublished,
        //       ProjectPublishStatus.Publishing,
        //     ].includes(project.publishStatus) || unPublishing
        //   }
        // >
        //   {unPublishing ? 'Unpublishing...' : 'Unpublish'}
        // </MintButton>
        // {
        //   // {project.publishStatus === ProjectPublishStatus.Published && (
        //   //   <MintButtonLink to={`/projects/#/${project.projectID}/`}>
        //   //     View published
        //   //   </MintButtonLink>
        //   // )}
        // }
      }
    </ButtonContainer>
  )
}

export default PublishUnpublishButtons
