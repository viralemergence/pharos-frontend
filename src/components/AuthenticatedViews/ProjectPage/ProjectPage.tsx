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
import MintToolbar, {
  MintToolbarButton,
  MintToolbarButtonLink,
  MintToolbarMore,
  MintToolbarMoreMenuButton,
} from 'components/ui/MintToolbar/MintToolbar'
import EditIcon from 'components/ui/MintToolbar/MintToolbarIcons/EditIcon'
import { ProjectPublishStatus } from 'reducers/stateReducer/types'
import UnpublishIcon from 'components/ui/MintToolbar/MintToolbarIcons/UnpublishIcon'
import MoreMenuDeleteIcon from 'components/ui/MintToolbar/MintToolbarIcons/MoreMenuDeleteIcon'
import PreviewIcon from 'components/ui/MintToolbar/MintToolbarIcons/PreviewIcon'
import useModal from 'hooks/useModal/useModal'
import CreateProjectForm, {
  CreateProjectFormMode,
} from '../PortfolioPage/CreateProjectForm/CreateProjectForm'
import usePublishing from './usePublishing'

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

  const setModal = useModal()

  const relatedMaterials = project.relatedMaterials
    ? commaSeparatedList(project.relatedMaterials)
    : '—'

  const { publish, unpublish, requestedPublishing, unPublishing } =
    usePublishing()

  const location: typeof window.location | Record<string, undefined> =
    typeof window !== 'undefined' ? window.location : {}

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
          {
            <PublishUnpublishButtons
              {...{
                publish,
                requestedPublishing,
              }}
            />
          }
          <MintToolbar>
            <MintToolbarButton
              tooltip="Edit"
              onClick={() =>
                setModal(
                  <CreateProjectForm
                    mode={CreateProjectFormMode.Edit}
                    project={project}
                  />,
                  { closeable: true }
                )
              }
            >
              <EditIcon />
            </MintToolbarButton>
            {project.publishStatus === ProjectPublishStatus.Published && (
              <MintToolbarButtonLink
                to={`/projects/?prj=${project.projectID}`}
                tooltip="Switch to public page"
              >
                <PreviewIcon />
              </MintToolbarButtonLink>
            )}
            {
              // <MintToolbarButton tooltip="Download (MAYBE)">
              //   <DownloadIcon />
              // </MintToolbarButton>
            }
          </MintToolbar>
          <MintToolbarMore>
            <MintToolbarMoreMenuButton
              disabled={
                [
                  ProjectPublishStatus.Unpublished,
                  ProjectPublishStatus.Publishing,
                ].includes(project.publishStatus) || unPublishing
              }
              onClick={() => unpublish()}
            >
              <UnpublishIcon /> Unpublish project
            </MintToolbarMoreMenuButton>
            <MintToolbarMoreMenuButton disabled>
              <MoreMenuDeleteIcon /> Delete project
            </MintToolbarMoreMenuButton>
          </MintToolbarMore>
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
          <h2>Researcher</h2>
          <p>{user.name}</p>
        </LoggedInProjectPageContentBox>
        <LoggedInProjectPageContentBox>
          <h2>Permanent project link</h2>
          <ClickToCopy
            copyContentString={`${location.origin}/projects/?prj=${project.projectID}`}
            style={{ marginTop: 10 }}
          >
            {location.hostname}/projects/?prj={project.projectID}
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
