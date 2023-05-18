import React from 'react'

import ListTable, { HeaderRow, RowLink } from 'components/ListTable/ListTable'

import { ProjectPublishStatusChip } from 'components/AuthenticatedViews/ProjectPage/PublishingStatusChip'

import useProjects from 'hooks/project/useProjects'

import formatDate from 'utilities/formatDate'

const ProjectsTable = () => {
  const projects = useProjects()

  const sorted =
    projects &&
    Object.values(projects).sort(
      (a, b) =>
        new Date(b.lastUpdated ?? '').getTime() -
        new Date(a.lastUpdated ?? '').getTime()
    )

  const columnTemplate = `
    2.5fr
    repeat(2, minmax(150px, 1fr))
    minmax(130px, 1fr)
    minmax(180px, 1fr)
    7em
  `

  return (
    <ListTable columnTemplate={columnTemplate} style={{ gridArea: 'projects' }}>
      <HeaderRow>
        <div>Project name</div>
        <div>Project status</div>
        <div>Last updated</div>
        <div>Project type</div>
        <div>Surveillance status</div>
        <div>Datasets</div>
      </HeaderRow>
      {sorted &&
        sorted.map(project => (
          <RowLink
            key={project.projectID}
            to={`/projects/${project.projectID}`}
          >
            <div>{project.name}</div>
            <div>
              {(
                <ProjectPublishStatusChip status={project.publishStatus}>
                  {project.publishStatus}
                </ProjectPublishStatusChip>
              ) || 'Unpublished'}
            </div>
            <div>
              {project.lastUpdated ? formatDate(project.lastUpdated) : '—'}
            </div>
            <div>{project.projectType || '—'}</div>
            <div>{project.surveillanceStatus || '—'}</div>
            <div>{project.datasetIDs?.length || 0}</div>
          </RowLink>
        ))}
    </ListTable>
  )
}

export default ProjectsTable
