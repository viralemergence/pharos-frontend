import React, { useEffect, useRef } from 'react'
import styled from 'styled-components'

import CreateDatasetForm from './CreateDatasetForm/CreateDatasetForm'
import MintButton from 'components/ui/MintButton'
import DatasetsTable from './DatasetsTable/DatasetsTable'
import { TopBar } from '../ViewComponents'
import useProject from 'hooks/project/useProject'
import useUser from 'hooks/useUser'
import Main from 'components/layout/Main'
import BreadcrumbLink, {
  BreadcrumbContainer,
} from 'components/ui/BreadcrumbLink'

import useModal from 'hooks/useModal/useModal'
import ProjectInfoPanel from './ProjectInfoPanel/ProjectInfoPanel'
import TextButton from 'components/ui/TextButton'
import PublishingHelpMessage from './PublishingHelpMessage/PublishingHelpMessage'
import { NodeStatus, ProjectPublishStatus } from 'reducers/stateReducer/types'
import useDispatch from 'hooks/useDispatch'
import { StateActions } from 'reducers/stateReducer/stateReducer'

const H1 = styled.h1`
  ${({ theme }) => theme.h1}
  margin: 15px 0;
`
const MainSection = styled.section`
  display: flex;
  gap: 40px;
  align-items: flex-start;
  margin-top: 20px;
`
const Left = styled.div`
  flex-basis: 66%;
  display: flex;
  flex-direction: column;
`
const Right = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  border: 1px solid ${({ theme }) => theme.medGray};
  padding: 15px;
`
const H2 = styled.h2`
  margin: 0;
  font-weight: normal;
  ${({ theme }) => theme.smallParagraph};
  margin: 0;
  color: ${({ theme }) => theme.darkGray};
  text-transform: uppercase;
  &:not(:first-child) {
    margin-top: 40px;
  }
`
const Description = styled.p`
  ${({ theme }) => theme.smallParagraph};
  margin: 0;
  color: ${({ theme }) => theme.black};
`
const Author = styled.p`
  ${({ theme }) => theme.smallParagraph};
  margin: 0;
  color: #13a69d;
`
const HorizontalBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-top: 40px;
`

const ProjectPage = () => {
  const user = useUser()
  const project = useProject()
  const setModal = useModal()
  const dispatch = useDispatch()

  // if the project is in "Publishing" status, poll for updates
  const { publishStatus } = project
  // useRef to prevent starting multiple pollers
  const publishingPoller = useRef<NodeJS.Timeout | null>(null)

  const [requestedPublishing, setRequestedPublishing] = React.useState(false)

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

      const json = await response.json()

      console.log(json)

      dispatch({
        type: StateActions.SetProjectPublishingStatus,
        payload: {
          projectID: project.projectID,
          publishStatus: ProjectPublishStatus.Publishing,
        },
      })

      setModal(
        <pre style={{ margin: '20px' }}>
          {project.name}: {JSON.stringify(json, null, 4)}
        </pre>,
        { closeable: true }
      )

      setRequestedPublishing(false)
    } catch (e) {
      console.log(e)
      setModal(
        <pre style={{ margin: '20px' }}>
          {project.name} publish status update:
          {JSON.stringify(e, null, 4)}
        </pre>,
        { closeable: true }
      )
    }
  }

  const unpublish = async () => {
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
    )

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

    const json = await response.json()

    setModal(
      <pre style={{ margin: 20 }}>{JSON.stringify(json, null, 4)}</pre>,
      { closeable: true }
    )
  }

  let publishButton: React.ReactNode
  if (requestedPublishing) {
    publishButton = <MintButton disabled>Loading...</MintButton>
  } else {
    switch (project.publishStatus) {
      case ProjectPublishStatus.Unpublished:
        publishButton = <MintButton onClick={publish}>Publish</MintButton>
        break
      case ProjectPublishStatus.Published:
        publishButton = (
          <MintButton onClick={unpublish} disabled>
            Publish
          </MintButton>
        )
        break
      case ProjectPublishStatus.Publishing:
        publishButton = <MintButton disabled>Publishing...</MintButton>
        break
      default:
        publishButton = <MintButton disabled>Unknown status</MintButton>
    }
  }

  return (
    <Main>
      <TopBar>
        <BreadcrumbContainer>
          <BreadcrumbLink to={`/projects/`}>All projects</BreadcrumbLink>
          <BreadcrumbLink $active to={`/projects/${project.projectID}`}>
            {project.name}
          </BreadcrumbLink>
        </BreadcrumbContainer>
        <PublishingHelpMessage />
      </TopBar>
      <TopBar>
        <H1>{project.name}</H1>
        <div style={{ display: 'flex', gap: 5 }}>
          {publishButton}
          {
            <MintButton
              onClick={unpublish}
              disabled={
                project.publishStatus !== ProjectPublishStatus.Published
              }
            >
              Unpublish
            </MintButton>
          }
        </div>
      </TopBar>
      <MainSection>
        <Left>
          <H2>Author</H2>
          <Author>{user.name}</Author>
          <H2>Description</H2>
          <Description>{project.description}</Description>
          <HorizontalBar>
            <H2>Datasets</H2>
            <TextButton
              primary
              onClick={() =>
                setModal(<CreateDatasetForm />, { closeable: true })
              }
            >
              + Add new Dataset
            </TextButton>
          </HorizontalBar>
          <DatasetsTable />
          <H2>Publications (this project)</H2>
          {!project.projectPublications ||
          project.projectPublications[0] === '' ? (
            <Description>—</Description>
          ) : (
            project?.projectPublications?.map(pub => (
              <Description>{pub}</Description>
            ))
          )}
          <H2>Publications (other people)</H2>
          {!project.othersCiting || project.othersCiting[0] === '' ? (
            <Description>—</Description>
          ) : (
            project?.othersCiting?.map(pub => <Description>{pub}</Description>)
          )}
        </Left>
        <Right>
          <ProjectInfoPanel />
        </Right>
      </MainSection>
    </Main>
  )
}

export default ProjectPage
