import React from 'react'

import Main from 'components/layout/Main'
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

const PortfolioPageLayout = styled.div``

const ProjectList = () => {
  const setModal = useModal()

  return (
    <Main>
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
        </Controls>
      </TopBar>
      <ProjectsTable />
    </Main>
  )
}
export default ProjectList
