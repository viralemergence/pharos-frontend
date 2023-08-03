import React from 'react'
import styled from 'styled-components'

import PublicViewBackground from '../PublicViewBackground'

import {
  ProjectPageMain,
  ProjectPageLayout,
  ProjectPageContentBox,
  ProjectPageSidebar,
} from 'components/ProjectPage/ProjectPageLayout'

import CitationsPublications from 'components/ProjectPage/CitationsPublications'

import TopBar, {
  Title,
  Controls,
  Breadcrumbs,
  PublicViewBreadcrumbLink,
} from 'components/layout/TopBar'

import usePublishedProject, { ProjectDataStatus } from './usePublishedProject'
import formatDate from 'utilities/formatDate'
import { MintButtonLink } from 'components/ui/MintButton'
import useAppState from 'hooks/useAppState'
import { UserStatus } from 'reducers/stateReducer/types'
import DatasetsTable from 'components/AuthenticatedViews/ProjectPage/DatasetsTable/DatasetsTable'
import ClickToCopy from 'components/ui/ClickToCopy'

const Container = styled.div`
  background-color: ${({ theme }) => theme.publicPagePurpleBackground};
  display: flow-root;
`
export const PublicProjectPageContentBox = styled(ProjectPageContentBox)<{
  interactive?: boolean
}>`
  position: relative;
  background-color: ${({ theme }) => theme.mutedPurple1};
  border: 1px solid ${({ theme }) => theme.white10PercentOpacity};
  border-top: none;
  color: ${({ theme }) => theme.white};
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;

  > h2 {
    color: ${({ theme }) => theme.medDarkGray};
  }

  &:before {
    background-color: ${({ theme, interactive }) =>
      interactive ? theme.mint : theme.white10PercentOpacity};
    content: '';
    position: absolute;
    top: 0;
    left: -1px;
    right: -1px;
    height: 5px;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
  }
`
const Author = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 10px;
`
const AuthorName = styled.div`
  ${({ theme }) => theme.smallParagraphSemibold};
  color: ${({ theme }) => theme.mint};
`
const AuthorOrganization = styled.div`
  ${({ theme }) => theme.extraSmallParagraph};
  color: ${({ theme }) => theme.medDarkGray};
`

const ProjectPage = () => {
  const { status, data: project } = usePublishedProject()
  const { user } = useAppState()

  if (status === ProjectDataStatus.Error) {
    console.log(project.error.message)
    return (
      <Container>
        <PublicViewBackground />
        <ProjectPageLayout>
          <TopBar darkmode>
            <Breadcrumbs>
              <PublicViewBreadcrumbLink to={`/data/`}>
                All data
              </PublicViewBreadcrumbLink>
              <PublicViewBreadcrumbLink to={`/data/`}>
                Projects
              </PublicViewBreadcrumbLink>
            </Breadcrumbs>
            <Title>Project not found</Title>
          </TopBar>
          <ProjectPageMain>
            <PublicProjectPageContentBox>
              <h2>Error message</h2>
              <pre style={{ color: 'white' }}>{project.error.message}</pre>
            </PublicProjectPageContentBox>
          </ProjectPageMain>
        </ProjectPageLayout>
      </Container>
    )
  }

  return (
    <Container>
      <PublicViewBackground />
      <ProjectPageLayout>
        <TopBar darkmode>
          <Breadcrumbs>
            <PublicViewBreadcrumbLink to={`/data/`}>
              All data
            </PublicViewBreadcrumbLink>
            <PublicViewBreadcrumbLink to={`/data/`}>
              Projects
            </PublicViewBreadcrumbLink>
            <PublicViewBreadcrumbLink
              $active
              to={`/projects/#/${project.projectID}`}
            >
              {status === ProjectDataStatus.Loaded
                ? project.name
                : 'Loading...'}
            </PublicViewBreadcrumbLink>
          </Breadcrumbs>
          <Title>
            {status === ProjectDataStatus.Loaded ? project.name : 'Loading...'}
          </Title>
          <Controls>
            {user.status === UserStatus.loggedIn &&
              user.data?.projectIDs?.includes(project.projectID) && (
                <MintButtonLink to={`/app/#/projects/${project.projectID}`}>
                  Manage project
                </MintButtonLink>
              )}
          </Controls>
        </TopBar>
        <ProjectPageMain>
          <PublicProjectPageContentBox>
            <h2>Description</h2>
            <p>
              {status === ProjectDataStatus.Loaded
                ? project.description
                : '...'}
            </p>
          </PublicProjectPageContentBox>
          {
            // <PublicProjectPageContentBox interactive>
            // <div
            //   style={{
            //     height: 400,
            //     display: 'flex',
            //     alignItems: 'center',
            //     justifyContent: 'center',
            //     color: 'darkgray',
            //     fontStyle: 'italic',
            //   }}
            // >
            //   Map placeholder
            // </div>
            // </PublicProjectPageContentBox>
          }
          <DatasetsTable
            publicView={true}
            project={project}
            datasets={
              status === ProjectDataStatus.Loaded ? project.datasets : []
            }
          />
          {status === ProjectDataStatus.Loading ||
            (status === ProjectDataStatus.Loaded &&
              (project.citation ||
                (project.othersCiting && project.othersCiting.length > 0) ||
                (project.projectPublications &&
                  project.projectPublications.length > 0)) && (
                <PublicProjectPageContentBox>
                  {status === ProjectDataStatus.Loaded && (
                    <CitationsPublications project={project} published />
                  )}
                </PublicProjectPageContentBox>
              ))}
        </ProjectPageMain>
        <ProjectPageSidebar>
          <PublicProjectPageContentBox>
            {status === ProjectDataStatus.Loaded ? (
              <>
                <h2>{project.authors.length === 1 ? 'Author' : 'Authors'}</h2>
                {project.authors.map(author => (
                  <Author key={author.name}>
                    <AuthorName>{author.name}</AuthorName>
                    <AuthorOrganization>
                      {author.organization}
                    </AuthorOrganization>
                  </Author>
                ))}
              </>
            ) : (
              <h2>Authors</h2>
            )}
          </PublicProjectPageContentBox>
          <PublicProjectPageContentBox>
            {status === ProjectDataStatus.Loaded ? (
              <>
                <h2>Permanent project link</h2>
                <ClickToCopy
                  darkmode
                  copyContentString={`${window.location.origin}/#/projects/${project.projectID}`}
                  style={{ marginTop: 10 }}
                >
                  {window.location.hostname}/#/projects/{project.projectID}
                </ClickToCopy>
                <h2>Project published</h2>
                <p>{formatDate(project.datePublished)}</p>
                {project.relatedMaterials &&
                  project.relatedMaterials.length > 0 && (
                    <>
                      <h2>Related materials</h2>
                      {project.relatedMaterials.map(material => (
                        <p key={material}>{material}</p>
                      ))}
                    </>
                  )}
                {project.projectType && (
                  <>
                    <h2>Project type</h2>
                    <p>{project.projectType || '—'}</p>
                  </>
                )}
                {project.surveillanceStatus && (
                  <>
                    <h2>Surveillance status</h2>
                    <p>{project.surveillanceStatus || '—'}</p>
                  </>
                )}
              </>
            ) : (
              <h2>Project published</h2>
            )}
          </PublicProjectPageContentBox>
        </ProjectPageSidebar>
      </ProjectPageLayout>
    </Container>
  )
}

export default ProjectPage
