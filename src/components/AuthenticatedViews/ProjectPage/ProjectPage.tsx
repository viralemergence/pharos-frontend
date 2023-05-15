import React from 'react'
import styled from 'styled-components'

import CreateDatasetForm from './CreateDatasetForm/CreateDatasetForm'
import DatasetsTable from './DatasetsTable/DatasetsTable'
import { TopBar } from '../../layout/ViewComponents'
import Main from 'components/layout/Main'
import BreadcrumbLink, {
  BreadcrumbContainer,
} from 'components/ui/BreadcrumbLink'

import TextButton from 'components/ui/TextButton'
import PublishUnpublishButtons from './PublishUnpublishButtons'
import ProjectInfoPanel from './ProjectInfoPanel/ProjectInfoPanel'
import PublishingHelpMessage from './PublishingHelpMessage/PublishingHelpMessage'

import useUser from 'hooks/useUser'
import useProject from 'hooks/project/useProject'
import useModal from 'hooks/useModal/useModal'

const H1 = styled.h1`
  ${({ theme }) => theme.h1}
  margin: 15px 0;
`
const MainSection = styled.section`
  display: flex;
  gap: 40px;
  align-items: flex-start;
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
  margin: 0;
  color: ${({ theme }) => theme.darkGray};
  text-transform: uppercase;
  &:not(:first-child) {
    margin-top: 40px;
  }
`
const Description = styled.p`
  ${({ theme }) => theme.smallParagraph};
  margin: 0;
  color: ${({ theme }) => theme.black};
`
const Author = styled.p`
  ${({ theme }) => theme.smallParagraph};
  margin: 0;
  color: #13a69d;
`
const HorizontalBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-top: 40px;
`

const ProjectPage = () => {
  const user = useUser()
  const project = useProject()
  const setModal = useModal()

  return (
    <Main>
      <TopBar>
        <BreadcrumbContainer>
          <BreadcrumbLink to={`/projects/`}>All projects</BreadcrumbLink>
          <BreadcrumbLink $active to={`/projects/${project.projectID}`}>
            {project.name}
          </BreadcrumbLink>
        </BreadcrumbContainer>
        <PublishingHelpMessage />
      </TopBar>
      <TopBar>
        <H1>{project.name}</H1>
        <PublishUnpublishButtons />
      </TopBar>
      <MainSection>
        <Left>
          <H2>Author</H2>
          <Author>{user.name}</Author>
          <H2>Description</H2>
          <Description>{project.description}</Description>
          <HorizontalBar>
            <H2>Datasets</H2>
            <TextButton
              primary
              onClick={() =>
                setModal(<CreateDatasetForm />, { closeable: true })
              }
            >
              + Add new Dataset
            </TextButton>
          </HorizontalBar>
          <DatasetsTable />
          <H2>Publications (this project)</H2>
          {!project.projectPublications ||
          project.projectPublications[0] === '' ? (
            <Description>—</Description>
          ) : (
            project?.projectPublications?.map(pub => (
              <Description>{pub}</Description>
            ))
          )}
          <H2>Publications (other people)</H2>
          {!project.othersCiting || project.othersCiting[0] === '' ? (
            <Description>—</Description>
          ) : (
            project?.othersCiting?.map(pub => <Description>{pub}</Description>)
          )}
        </Left>
        <Right>
          <ProjectInfoPanel />
        </Right>
      </MainSection>
    </Main>
  )
}

export default ProjectPage
