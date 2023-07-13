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

const ProjectPage = () => {
  const project = usePublishedProject()

  return (
    <>
      <PublicViewBackground />
      <ProjectPageLayout>
        <TopBar>
          <Title>Project Page: projectID = {projectID}</Title>
        </TopBar>
      </ProjectPageLayout>
    </>
  )
}

export default ProjectPage
