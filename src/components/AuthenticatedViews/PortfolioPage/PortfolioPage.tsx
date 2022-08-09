import React, { useState } from 'react'
import styled from 'styled-components'

import MainGrid from 'components/layout/MainGrid'
import Sidebar from 'components/Sidebar/Sidebar'
import MintButton from 'components/ui/MintButton'
import Modal from 'components/ui/Modal'

import { Content, TopBar } from '../ViewComponents'
import CreateProjectForm from './CreateProjectForm/CreateProjectForm'
import ProjectsTable from './ProjectsTable/ProjectsTable'

const H1 = styled.h1`
  ${({ theme }) => theme.h3}
  margin: 0;
`

const ProjectList = () => {
  const [createModalOpen, setCreateModalOpen] = useState(false)

  return (
    <MainGrid>
      <Sidebar />
      <Content>
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
      </Content>
    </MainGrid>
  )
}

export default ProjectList
