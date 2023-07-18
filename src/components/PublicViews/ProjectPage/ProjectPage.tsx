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
  Breadcrumbs,
  BreadcrumbLink,
} from 'components/layout/TopBar'

import usePublishedProject from './usePublishedProject'
import formatDate from 'utilities/formatDate'

const Container = styled.div`
  background-color: ${({ theme }) => theme.lightBlack};
  display: flow-root;
`
const PublicProjectPageContentBox = styled(ProjectPageContentBox)`
  background-color: ${({ theme }) => theme.medBlack};
  border-top: 5px solid ${({ theme }) => theme.mint};
  color: ${({ theme }) => theme.white};

  > h2 {
    color: ${({ theme }) => theme.medDarkGray};
  }
`
const PublicTitle = styled(Title)`
  color: ${({ theme }) => theme.white};
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
  const project = usePublishedProject()

  return (
    <Container>
      <PublicViewBackground />
      <ProjectPageLayout>
        <TopBar>
          <Breadcrumbs>
            <BreadcrumbLink to={`/data/`}>All data</BreadcrumbLink>
            <BreadcrumbLink to={`/data/`}>Projects</BreadcrumbLink>
            <BreadcrumbLink $active to={`/projects/#/${project.projectID}`}>
              {project.name}
            </BreadcrumbLink>
          </Breadcrumbs>
          <PublicTitle>
            Project Page: projectID = {project.projectID}
          </PublicTitle>
        </TopBar>
        <ProjectPageMain>
          <PublicProjectPageContentBox>
            <h2>Description</h2>
            <p>{project.description || '—'}</p>
          </PublicProjectPageContentBox>
          <PublicProjectPageContentBox>
            <div
              style={{
                background: 'darkgray',
                height: 400,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              Map placeholder
            </div>
          </PublicProjectPageContentBox>
          <PublicProjectPageContentBox>
            <div
              style={{
                background: 'darkgray',
                height: 100,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              Datasets placeholder
            </div>
          </PublicProjectPageContentBox>
          <PublicProjectPageContentBox>
            <CitationsPublications project={project} />
          </PublicProjectPageContentBox>
        </ProjectPageMain>
        <ProjectPageSidebar>
          <PublicProjectPageContentBox>
            <h2>{project.authors.length === 1 ? 'Author' : 'Authors'}</h2>
            {project.authors.map(author => (
              <Author>
                <AuthorName>{author.name}</AuthorName>
                <AuthorOrganization>{author.organization}</AuthorOrganization>
              </Author>
            ))}
          </PublicProjectPageContentBox>
          <PublicProjectPageContentBox>
            <h2>Project published</h2>
            <p>{formatDate(project.datePublished)}</p>
            <h2>Project ID</h2>
            <p>{project.projectID}</p>
            {project.relatedMaterials && (
              <>
                <h2>Related materials</h2>
                {project.relatedMaterials.map(material => (
                  <p>{material}</p>
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
          </PublicProjectPageContentBox>
        </ProjectPageSidebar>
      </ProjectPageLayout>
    </Container>
  )
}

export default ProjectPage
