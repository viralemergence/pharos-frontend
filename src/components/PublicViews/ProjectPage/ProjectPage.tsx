import React from 'react'
import useProjectID from 'hooks/project/useProjectID'

const ProjectPage = () => {
  const projectID = useProjectID()

  return <p>Project Page: projectID = {projectID}</p>
}

export default ProjectPage
