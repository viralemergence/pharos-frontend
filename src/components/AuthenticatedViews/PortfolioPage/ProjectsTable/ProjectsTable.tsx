import React from 'react'

import ListTable, {
  HeaderRow,
  RowLink,
  TableCell,
} from 'components/ListTable/ListTable'

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

  const wideColumnTemplate = `
    2.5fr
    repeat(2, minmax(150px, 1fr))
    minmax(130px, 1fr)
    minmax(180px, 1fr)
    7em
  `

  const mediumColumnTemplate = `
    2.5fr
    repeat(2, minmax(150px, 1fr))
    7em
  `

  return (
    <ListTable
      wideColumnTemplate={wideColumnTemplate}
      mediumColumnTemplate={mediumColumnTemplate}
      style={{ gridArea: 'projects' }}
    >
      <HeaderRow>
        <TableCell>Project name</TableCell>
        <TableCell>Project status</TableCell>
        <TableCell>Last updated</TableCell>
        <TableCell hideMedium>Project type</TableCell>
        <TableCell hideMedium>Surveillance status</TableCell>
        <TableCell>Datasets</TableCell>
      </HeaderRow>
      {sorted &&
        sorted.map(project => (
          <RowLink
            key={project.projectID}
            to={`/projects/${project.projectID}`}
          >
            <TableCell cardOrder={2}>{project.name}</TableCell>
            <TableCell cardOrder={3}>
              {(
                <ProjectPublishStatusChip status={project.publishStatus}>
                  {project.publishStatus}
                </ProjectPublishStatusChip>
              ) || 'Unpublished'}
            </TableCell>
            <TableCell cardOrder={1}>
              {project.lastUpdated ? formatDate(project.lastUpdated) : '—'}
            </TableCell>
            <TableCell hideMedium>{project.projectType || '—'}</TableCell>
            <TableCell hideMedium>
              {project.surveillanceStatus || '—'}
            </TableCell>
            <TableCell hideMobile>{project.datasetIDs?.length || 0}</TableCell>
          </RowLink>
        ))}
    </ListTable>
  )
}

export default ProjectsTable
