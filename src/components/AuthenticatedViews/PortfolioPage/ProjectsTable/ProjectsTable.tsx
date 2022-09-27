import React, { useEffect, useState } from 'react'

import ListTable, { HeaderRow, RowLink } from 'components/ListTable/ListTable'
import useProjectDispatch from 'hooks/project/useProjectDispatch'
import { ProjectActions } from 'reducers/projectReducer/projectReducer'
import { Project } from 'reducers/projectReducer/types'
import listProjects from 'api/listProjects'
import useUser from 'hooks/useUser'

enum Status {
  'Initial',
  'Loading',
  'Loaded',
  'Error',
}

interface Projects {
  status: Status
  projects?: Project[]
}

const ProjectsTable = () => {
  const projectDispatch = useProjectDispatch()
  const user = useUser()

  const [projects, setProjects] = useState<Projects>({ status: Status.Initial })

  useEffect(() => {
    const getProjectList = async (researcherID?: string) => {
      if (!researcherID) return

      setProjects({ status: Status.Loaded, projects: [] })

      const projects = await listProjects(researcherID)

      if (projects) setProjects({ status: Status.Loaded, projects })
      else setProjects({ status: Status.Error })
    }

    const researcherID = user.data?.researcherID

    getProjectList(researcherID)
  }, [user])

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
        <div>Surveillance status</div>
        <div># of datasets</div>
        <div>Last updated</div>
        <div>Project status</div>
      </HeaderRow>
      {projects.status === Status.Loaded &&
        projects.projects &&
        Object.values(projects.projects).map(project => (
          <RowLink
            key={project.projectID}
            onClick={() => handleClick(project)}
            to={`/projects/${project.projectID}`}
          >
            <div>{project.name}</div>
            <div>{project.projectType || '—'}</div>
            <div>{project.surveillanceStatus || '—'}</div>
            <div>datasets {project.datasetIDs.length}</div>
            <div>
              {project.lastUpdated
                ? new Date(project.lastUpdated).toLocaleString()
                : '—'}
            </div>
            <div>{project.publishStatus || 'Unpublished'}</div>
          </RowLink>
        ))}
    </ListTable>
  )
}

export default ProjectsTable
