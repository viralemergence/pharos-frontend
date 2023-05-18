import React, { useState } from 'react'

import MintButton from 'components/ui/MintButton'
import Modal from 'components/ui/Modal'

import CreateProjectForm from './CreateProjectForm/CreateProjectForm'
import ProjectsTable from './ProjectsTable/ProjectsTable'
import Main from 'components/layout/Main'

import TopBar, {
  Title,
  Controls,
  Breadcrumbs,
  BreadcrumbLink,
} from 'components/layout/TopBar'

const ProjectList = () => {
  const [createModalOpen, setCreateModalOpen] = useState(false)

  return (
    <Main>
      <TopBar>
        <Breadcrumbs>
          <BreadcrumbLink to={`/projects/`}>All projects</BreadcrumbLink>
        </Breadcrumbs>
        <Title>My Projects</Title>
        <Controls>
          <MintButton onClick={() => setCreateModalOpen(true)}>
            + New Project
          </MintButton>
          <Modal closeable open={createModalOpen} setOpen={setCreateModalOpen}>
            <CreateProjectForm />
          </Modal>
        </Controls>
      </TopBar>
      <ProjectsTable />
    </Main>
  )
}

export default ProjectList
