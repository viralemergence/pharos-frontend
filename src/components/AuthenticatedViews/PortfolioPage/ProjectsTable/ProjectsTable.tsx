import React from 'react'

import ListTable, { HeaderRow, RowLink } from 'components/ListTable/ListTable'
import useProjectDispatch from 'hooks/project/useProjectDispatch'
import { ProjectActions } from 'reducers/projectReducer/projectReducer'
import { Project } from 'reducers/projectReducer/types'

enum Status {
  'Initial',
  'Loading',
  'Loaded',
  'Error',
}

const ProjectsTable = () => {
  const projectDispatch = useProjectDispatch()

  const [projects, setProjects] = useState({
    status: Status.Initial,
    projects: [],
  })

  const handleClick = (project: Project) => {
    console.log({ project })
    projectDispatch({
      type: ProjectActions.SetProject,
      payload: project,
    })
  }

  console.log({ projects })

  return (
    <ListTable columnTemplate="repeat(6, 1fr)">
      <HeaderRow>
        <div>Project name</div>
        <div>Project type</div>
        <div>Surveillance type</div>
        <div>Surveillance status</div>
        <div># of datasets</div>
        <div>Last updated</div>
      </HeaderRow>
      {Object.values(projectsObj).map(project => (
        <RowLink
          key={project.projectID}
          onClick={() => handleClick(project)}
          to={`/projects/${project.projectID}`}
        >
          <div>{project.name}</div>
          <div>{project.projectType || '—'}</div>
          <div>{project.surveillanceType || '—'}</div>
          <div>{project.surveillanceStatus || '—'}</div>
          <div>{project.datasetIDs.length}</div>
          <div>
            {project.lastUpdated
              ? new Date(project.lastUpdated).toLocaleString()
              : '—'}
          </div>
        </RowLink>
      ))}
    </ListTable>
  )
}

export default ProjectsTable
