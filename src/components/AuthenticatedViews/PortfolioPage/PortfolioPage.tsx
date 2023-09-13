import React from 'react'

import MintButton from 'components/ui/MintButton'
import ProjectsTable from './ProjectsTable/ProjectsTable'
import CreateProjectForm from './CreateProjectForm/CreateProjectForm'

import TopBar, {
  Title,
  Controls,
  Breadcrumbs,
  BreadcrumbLink,
} from 'components/layout/TopBar'

import useModal from 'hooks/useModal/useModal'
import styled from 'styled-components'
import wideMargins from 'components/layout/Margins'
import DownloadTemplateButton from './DownloadTemplateButton'
import DownloadDefinitionsButton from './DownloadDefinitionsButton'

const PortfolioPageLayout = styled.div`
  ${wideMargins}
  display: grid;
  gap: 30px;
  grid-template-areas:
    'topbar'
    'projects';
`

const ProjectList = () => {
  const setModal = useModal()

  return (
    <PortfolioPageLayout>
      <TopBar>
        <Breadcrumbs>
          <BreadcrumbLink to={`/projects/`}>All projects</BreadcrumbLink>
        </Breadcrumbs>
        <Title>My Projects</Title>
        <Controls>
          <MintButton
            onClick={() => setModal(<CreateProjectForm />, { closeable: true })}
          >
            + New Project
          </MintButton>
          <DownloadTemplateButton />
          <DownloadDefinitionsButton />
        </Controls>
      </TopBar>
      <ProjectsTable />
    </PortfolioPageLayout>
  )
}
export default ProjectList
