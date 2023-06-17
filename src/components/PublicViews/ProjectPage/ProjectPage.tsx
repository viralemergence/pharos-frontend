import React from 'react'

import { ProjectPageLayout } from 'components/ProjectPage/ProjectPageLayout'

import PublicViewBackground from '../PublicViewBackground'

import useProjectID from 'hooks/project/useProjectID'

const ProjectPage = () => {
  const projectID = useProjectID()

  return (
    <>
      <PublicViewBackground />
      <ProjectPageLayout>
        <p>Project Page: projectID = {projectID}</p>
      </ProjectPageLayout>
    </>
  )
}

export default ProjectPage
