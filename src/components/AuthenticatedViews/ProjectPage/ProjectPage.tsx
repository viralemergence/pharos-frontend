import React from 'react'
import styled from 'styled-components'

import TopBar, {
  Title,
  Controls,
  Breadcrumbs,
  BreadcrumbLink,
} from 'components/layout/TopBar'

import {
  ProjectPageMain,
  ProjectPageLayout,
  ProjectPageSidebar,
  ProjectPageContentBox,
  hideInWideView,
  hideInNarrowView,
} from 'components/ProjectPage/ProjectPageLayout'

import CitationsPublications from 'components/ProjectPage/CitationsPublications'

import PublishUnpublishButtons from './PublishUnpublishButtons'
import DatasetsTable from './DatasetsTable/DatasetsTable'
import { ProjectPublishStatusChip } from './PublishingStatusChip'

import useUser from 'hooks/useUser'
import useProject from 'hooks/project/useProject'

import { commaSeparatedList } from 'utilities/grammar'
import useDatasets from 'hooks/dataset/useDatasets'
import ClickToCopy from 'components/ui/ClickToCopy'

const LoggedInProjectPageContentBox = styled(ProjectPageContentBox)`
  background-color: ${({ theme }) => theme.isThisGrayEvenHereItsSoLight};

  > h2 {
    color: ${({ theme }) => theme.darkGray};
  }
`

const MobileProjectStatus = styled(LoggedInProjectPageContentBox)`
  ${hideInWideView};
`

const WideProjectStatus = styled(LoggedInProjectPageContentBox)`
  ${hideInNarrowView};
`

const ProjectStatus = () => {
  const project = useProject()

  return (
    <>
      <h2>Project status</h2>
      <p>
        <ProjectPublishStatusChip status={project.publishStatus}>
          {project.publishStatus}
        </ProjectPublishStatusChip>
      </p>
    </>
  )
}

const ProjectPage = () => {
  const user = useUser()
  const project = useProject()
  const datasets = useDatasets()

  const relatedMaterials = project.relatedMaterials
    ? commaSeparatedList(project.relatedMaterials)
    : '—'

  return (
    <ProjectPageLayout>
      <TopBar>
        <Breadcrumbs>
          <BreadcrumbLink to={`/projects/`}>All projects</BreadcrumbLink>
          <BreadcrumbLink $active to={`/projects/${project.projectID}`}>
            {project.name}
          </BreadcrumbLink>
        </Breadcrumbs>
        <Title>{project.name}</Title>
        <Controls>
          <PublishUnpublishButtons />
        </Controls>
      </TopBar>
      <ProjectPageMain>
        <MobileProjectStatus>
          <ProjectStatus />
        </MobileProjectStatus>
        <DatasetsTable
          publicView={false}
          project={project}
          datasets={datasets}
        />
        <LoggedInProjectPageContentBox style={{}}>
          <h2>Description</h2>
          <p>{project.description || '—'}</p>
          <CitationsPublications project={project} />
        </LoggedInProjectPageContentBox>
      </ProjectPageMain>
      <ProjectPageSidebar>
        <WideProjectStatus>
          <ProjectStatus />
        </WideProjectStatus>
        <LoggedInProjectPageContentBox>
          <h2>Author</h2>
          <p>{user.name}</p>
        </LoggedInProjectPageContentBox>
        <LoggedInProjectPageContentBox>
          <h2>Project perminant link</h2>
          <ClickToCopy
            copyContentString={`${window.location.origin}/#/projects/${project.projectID}`}
            style={{ marginTop: 10 }}
          >
            {window.location.hostname}/#/projects/{project.projectID}
          </ClickToCopy>
          <h2>Project type</h2>
          <p>{project.projectType || '—'}</p>
          <h2>Surveillance status</h2>
          <p>{project.surveillanceStatus || '—'}</p>
          <h2>Related materials</h2>
          <p>{relatedMaterials || '—'}</p>
        </LoggedInProjectPageContentBox>
      </ProjectPageSidebar>
    </ProjectPageLayout>
  )
}

export default ProjectPage
