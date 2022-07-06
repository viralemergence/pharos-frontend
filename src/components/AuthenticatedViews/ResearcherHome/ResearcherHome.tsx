import React, { useState } from 'react'
import styled from 'styled-components'

import Sidebar from 'components/Sidebar/Sidebar'
import MainGrid from 'components/layout/MainGrid'
import Modal from 'components/ui/Modal'
import CreateDatasetForm from './CreateDatasetForm/CreateDatasetForm'
import MintButton from 'components/ui/MintButton'
import DatasetsTable from './DatasetsTable/DatasetsTable'

const Content = styled.div`
  overflow-y: scroll;
  padding: 40px;
`
const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`
const H1 = styled.h1`
  ${({ theme }) => theme.h3}
  margin: 0;
`

const ResearcherHome = () => {
  const [createModalOpen, setCreateModalOpen] = useState(false)

  return (
    <MainGrid>
      <Sidebar />
      <Content>
        <TopBar>
          <H1>My Datasets</H1>
          <MintButton onClick={() => setCreateModalOpen(true)}>
            + New Dataset
          </MintButton>
          <Modal closeable open={createModalOpen} setOpen={setCreateModalOpen}>
            <CreateDatasetForm />
          </Modal>
        </TopBar>
        <DatasetsTable />
      </Content>
    </MainGrid>
  )
}

export default ResearcherHome
