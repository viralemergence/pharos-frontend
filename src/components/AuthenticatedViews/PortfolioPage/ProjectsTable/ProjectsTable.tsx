import React, { useEffect, useState } from 'react'

import ListTable, { HeaderRow, RowLink } from 'components/ListTable/ListTable'
import useDispatch from 'hooks/project/useProjectDispatch'
import { ProjectActions } from 'reducers/projectReducer/projectReducer'
import { Project } from 'reducers/projectReducer/types'
import listProjects from 'api/listProjects'
import localforage from 'localforage'
import useAppState from 'hooks/project/useProject'
import useProjects from 'hooks/project/useProjects'

const ProjectsTable = () => {
  const projects = useProjects()

  // useEffect(() => {
  //   const getProjectList = async (researcherID?: string) => {
  //     if (!researcherID) return

  //     const localProjects = (await localforage.getItem('projects')) as Project[]

  //     const projects = await listProjects(researcherID)

  //     if (projects) setProjects({ status: Status.Loaded, projects })
  //     else setProjects({ status: Status.Error })
  //   }

  //   const researcherID = user.data?.researcherID

  //   getProjectList(researcherID)
  // }, [user])

  // const handleClick = (project: Project) => {
  //   console.log({ project })

  //   dispatch({
  //     type: ProjectActions.SetProject,
  //     payload: project,
  //   })
  // }

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
