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
import { Link } from 'gatsby-link'

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
  align-items: flex-start;
`
const AuthorName = styled(Link)`
  ${({ theme }) => theme.smallParagraphSemibold};
  color: ${({ theme }) => theme.mint};
  text-decoration: none !important;

  &:hover {
    text-decoration: underline !important;
  }
`
const AuthorOrganization = styled.div`
  ${({ theme }) => theme.extraSmallParagraph};
  color: ${({ theme }) => theme.medDarkGray};
`

const ProjectPage = () => {
  const { status, data: project } = usePublishedProject()
  const { user } = useAppState()

  const location: typeof window.location | Record<string, undefined> =
    typeof window !== 'undefined' ? window.location : {}

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
              to={`/projects/?prj=${project.projectID}`}
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
            {user.status === UserStatus.LoggedIn &&
              user.data?.projectIDs?.includes(project.projectID) && (
                <MintButtonLink to={`/app/#/projects/${project.projectID}`}>
                  Manage project
                </MintButtonLink>
              )}
          </Controls>
        </TopBar>
        <ProjectPageMain>
          {(status === ProjectDataStatus.Loading ||
            (status === ProjectDataStatus.Loaded && project.description)) && (
            <PublicProjectPageContentBox>
              <h2>Description</h2>
              <p>
                {status === ProjectDataStatus.Loaded
                  ? project.description
                  : '...'}
              </p>
            </PublicProjectPageContentBox>
          )}
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
          {(status === ProjectDataStatus.Loading ||
            (status === ProjectDataStatus.Loaded &&
              (project.citation ||
                (project.othersCiting && project.othersCiting.length > 0) ||
                (project.projectPublications &&
                  project.projectPublications.length > 0)))) && (
            <PublicProjectPageContentBox>
              {status === ProjectDataStatus.Loaded && (
                <CitationsPublications project={project} published />
              )}
              {status === ProjectDataStatus.Loading && (
                <>
                  <h2>How to cite this project</h2>
                  <ClickToCopy
                    darkmode
                    style={{ marginTop: 10 }}
                    copyContentString={''}
                  >
                    &nbsp;
                  </ClickToCopy>
                </>
              )}
            </PublicProjectPageContentBox>
          )}
        </ProjectPageMain>
        <ProjectPageSidebar>
          <PublicProjectPageContentBox>
            {status === ProjectDataStatus.Loaded ? (
              <>
                <h2>
                  {project.authors.length === 1 ? 'Researcher' : 'Researchers'}
                </h2>
                {project.authors.map(author => (
                  <Author key={author.name}>
                    <AuthorName
                      to={`/researchers/?researcherID=${author.researcherID}`}
                    >
                      {author.name}
                    </AuthorName>
                    <AuthorOrganization>
                      {author.organization}
                    </AuthorOrganization>
                  </Author>
                ))}
              </>
            ) : (
              <>
                <h2>Researchers</h2>
                <Author>
                  <AuthorName to={`#`}>&nbsp;</AuthorName>
                  <AuthorOrganization>&nbsp;</AuthorOrganization>
                </Author>
              </>
            )}
          </PublicProjectPageContentBox>
          <PublicProjectPageContentBox>
            <>
              <h2>Permanent project link</h2>
              <ClickToCopy
                darkmode
                copyContentString={`${location.origin}/projects/?prj=${project.projectID}`}
                style={{ marginTop: 10 }}
              >
                {location.hostname}/projects/?prj={project.projectID}
              </ClickToCopy>
            </>
            {status === ProjectDataStatus.Loaded ? (
              <>
                <h2>Project published</h2>
                <p>{formatDate(project.datePublished)}</p>
                {project.relatedMaterials && project.relatedMaterials[0] && (
                  <>
                    <h2>Related materials</h2>
                    {project.relatedMaterials.map(material => (
                      <p style={{wordWrap: 'break-word'}} key={material}>{material}</p>
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
              <>
                <h2>Project published</h2>
                <p>&nbsp;</p>
              </>
            )}
          </PublicProjectPageContentBox>
        </ProjectPageSidebar>
      </ProjectPageLayout>
    </Container>
  )
}

export default ProjectPage
