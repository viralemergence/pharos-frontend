import React from 'react'

import { ProjectPageMain } from 'components/ProjectPage/ProjectPageLayout'

import PublicViewBackground from '../PublicViewBackground'

import useProjectID from 'hooks/project/useProjectID'

const ProjectPage = () => {
  const projectID = useProjectID()

  return (
    <>
      <PublicViewBackground />
      <ProjectPageMain>
        <p>Project Page: projectID = {projectID}</p>
      </ProjectPageMain>
    </>
  )
}

export default ProjectPage
