import React, { useState } from 'react'
import styled from 'styled-components'

import Modal from 'components/ui/Modal'
import CreateDatasetForm from './CreateDatasetForm/CreateDatasetForm'
import PublishProjectModal from './PublishProjectModal/PublishProjectModal'
import MintButton from 'components/ui/MintButton'
import DatasetsTable from './DatasetsTable/DatasetsTable'
import { TopBar } from '../ViewComponents'
import useAutosaveProject from 'hooks/project/useAutosaveProject'
import useProject from 'hooks/project/useProject'
import useUser from 'hooks/useUser'
import Main from 'components/layout/Main'
import BreadcrumbLink, {
  BreadcrumbContainer,
} from 'components/ui/BreadcrumbLink'
import useModalMessage from '../DatasetEditor/DatasetGrid/ModalMessage/useModalMessage'

const H1 = styled.h1`
  ${({ theme }) => theme.h3}
  margin: 0;
`
const MainSection = styled.section`
  display: flex;
  gap: 15px;
  justify-content: stretch;
  margin-top: 20px;
`
const Left = styled.div`
  flex-basis: 66%;
  display: flex;
  flex-direction: column;
`
const Right = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  border: 1px solid ${({ theme }) => theme.medGray};
  padding: 15px;
`
const H2 = styled.h2`
  margin: 0;
  font-weight: normal;
  ${({ theme }) => theme.smallParagraph};
  color: ${({ theme }) => theme.darkGray};
  text-transform: uppercase;
`
const Description = styled.p`
  ${({ theme }) => theme.smallParagraph};
  color: ${({ theme }) => theme.black};
`
const Author = styled.p`
  ${({ theme }) => theme.smallParagraph};
  color: #13a69d;
`

const ProjectPage = () => {
  const user = useUser()
  const project = useProject()

  const setModalMessage = useModalMessage()

  // Save any changes to the project
  // to the server
  useAutosaveProject()

  return (
    <Main>
      <TopBar>
        <BreadcrumbContainer>
          <BreadcrumbLink to={`/projects/`}>All projects</BreadcrumbLink>
          <BreadcrumbLink active to={`/projects/${project.projectID}`}>
            {project.projectName}
          </BreadcrumbLink>
        </BreadcrumbContainer>
      </TopBar>
      <TopBar>
        <H1>{project.projectName}</H1>
        <MintButton onClick={() => setModalMessage(<PublishProjectModal />)}>
          Publish project
        </MintButton>
      </TopBar>
      <MainSection>
        <Left>
          <H2>Author</H2>
          <Author>{user.data?.name}</Author>
          <H2>Description</H2>
          <Description>{project.description}</Description>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <H2>Datasets</H2>
            <MintButton
              onClick={() =>
                setModalMessage(<CreateDatasetForm />, { closeable: true })
              }
            >
              + New Dataset
            </MintButton>
          </div>
          <DatasetsTable />
        </Left>
        <Right></Right>
      </MainSection>
    </Main>
  )
}

export default ProjectPage
