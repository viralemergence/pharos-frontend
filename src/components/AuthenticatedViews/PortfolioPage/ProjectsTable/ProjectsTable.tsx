import React from 'react'

import ListTable, { HeaderRow, RowLink } from 'components/ListTable/ListTable'

import useProjects from 'hooks/project/useProjects'

const ProjectsTable = () => {
  const projects = useProjects()

  const sorted =
    projects &&
    Object.values(projects).sort(
      (a, b) =>
        new Date(b.lastUpdated ?? '').getTime() -
        new Date(a.lastUpdated ?? '').getTime()
    )

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
      {sorted &&
        sorted.map(project => (
          <RowLink
            key={project.projectID}
            to={`/projects/${project.projectID}`}
          >
            <div>{project.name}</div>
            <div>{project.projectType || '—'}</div>
            <div>{project.surveillanceStatus || '—'}</div>
            <div>datasets {project.datasetIDs?.length || 0}</div>
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
