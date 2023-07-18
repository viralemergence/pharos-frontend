import React from 'react'
import styled from 'styled-components'

import PublicViewBackground from '../PublicViewBackground'

import {
  ProjectPageMain,
  ProjectPageLayout,
  // ProjectPageSidebar,
  ProjectPageContentBox,
} from 'components/ProjectPage/ProjectPageLayout'

import CitationsPublications from 'components/ProjectPage/CitationsPublications'

import TopBar, {
  Title,
  // Controls,
  Breadcrumbs,
  BreadcrumbLink,
} from 'components/layout/TopBar'

import usePublishedProject from './usePublishedProject'

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
      </ProjectPageLayout>
    </Container>
  )
}

export default ProjectPage
