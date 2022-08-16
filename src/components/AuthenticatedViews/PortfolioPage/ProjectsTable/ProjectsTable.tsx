import React from 'react'

import ListTable, { HeaderRow, RowLink } from 'components/ListTable/ListTable'
import useProjecsObj from 'hooks/project/useProjectsObj'
import useProjectDispatch from 'hooks/project/useProjectDispatch'
import { ProjectActions } from 'reducers/projectReducer/projectReducer'
import { Project } from 'reducers/projectReducer/types'

const ProjectsTable = () => {
  const projectsObj = useProjecsObj()
  const projectDispatch = useProjectDispatch()

  console.log({ projectsObj })
  console.log(JSON.stringify(projectsObj))

  const handleClick = (project: Project) => {
    projectDispatch({
      type: ProjectActions.SetProject,
      payload: project,
    })
  }

  return (
    <ListTable columnTemplate="repeat(7, 1fr)">
      <HeaderRow>
        <div>Project name</div>
        <div>Start date</div>
        <div>Type</div>
        <div>Surveillance type</div>
        <div># of datasets</div>
        <div># of organisms</div>
        <div>Last updated</div>
      </HeaderRow>
      {Object.values(projectsObj).map(project => (
        <RowLink
          key={project.projectID}
          onClick={() => handleClick(project)}
          to={`/projects/${project.projectID}`}
        >
          <div>{project.projectName}</div>
          <div>start date</div>
          <div>{project.projectType}</div>
          <div>{project.surveillanceType}</div>
        </RowLink>
      ))}
    </ListTable>
  )
}

export default ProjectsTable
