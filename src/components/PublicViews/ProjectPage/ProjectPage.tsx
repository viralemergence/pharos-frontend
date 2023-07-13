import React from 'react'

import { ProjectPageLayout } from 'components/ProjectPage/ProjectPageLayout'

import PublicViewBackground from '../PublicViewBackground'

import TopBar, {
  Title,
  Controls,
  Breadcrumbs,
  BreadcrumbLink,
  } from 'components/layout/TopBar'

import usePublishedProject from './usePublishedProject'

const PublicProjectPageContentBox = styled(ProjectPageContentBox)`
  background-color: ${({theme}) => theme.medBlack};
  border-top: 5px solid ${({theme}) => theme.mint};

  > h2 {
    color: ${({theme}) => theme.medDarkGray};
  }
`

const ProjectPage = () => {
  const project = usePublishedProject()

  return (
    <>
      <PublicViewBackground />
      <ProjectPageLayout>
        <TopBar>
          <Breadcrumbs>
            <BreadcrumbLink to={`/data/`}>All data</BreadcrumbLink>
            <BreadcrumbLink to={`/data/`}>Projects</BreadcrumbLink>
            <BreadcrumbLink $active to={`/projects/#/${project.projectID}`>
              {project.name}
            </BreadcrumbLink>
          </Breadcrumbs>
          <Title>Project Page: projectID = {projectID}</Title>
        </TopBar>
      </ProjectPageLayout>
    </>
  )
}

export default ProjectPage
