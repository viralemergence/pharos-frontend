import React, { useState } from 'react'
import styled from 'styled-components'

import MintButton from 'components/ui/MintButton'
import Modal from 'components/ui/Modal'

import { TopBar } from '../ViewComponents'
import CreateProjectForm from './CreateProjectForm/CreateProjectForm'
import ProjectsTable from './ProjectsTable/ProjectsTable'
import Main from 'components/layout/Main'

const H1 = styled.h1`
  ${({ theme }) => theme.h3}
  margin: 0;
`

const ProjectList = () => {
  const [createModalOpen, setCreateModalOpen] = useState(false)

  return (
    <Main>
      <TopBar>
        <H1>My Projects</H1>
        <MintButton onClick={() => setCreateModalOpen(true)}>
          + New Project
        </MintButton>
        <Modal closeable open={createModalOpen} setOpen={setCreateModalOpen}>
          <CreateProjectForm />
        </Modal>
      </TopBar>
      <ProjectsTable />
    </Main>
  )
}

export default ProjectList
