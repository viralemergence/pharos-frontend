import React from 'react'
import styled from 'styled-components'

import DatasetGrid from './DatasetGrid/DatasetsGrid'

import CSVUploader from './CSVParser/CSVUploader'
import { TopBar } from '../ViewComponents'

import DownloadButton from './DownloadButton/DownloadButton'
import ReleaseButton from './ReleaseButton/ReleaseButton'
import ReleaseHelpMessage from './ReleaseHelpMessage/ReleaseHelpMessage'

import useDataset from 'hooks/dataset/useDataset'

import BreadcrumbLink, {
  BreadcrumbContainer,
} from 'components/ui/BreadcrumbLink'

import useProject from 'hooks/project/useProject'
import DatasetStatusMessage from './DatasetStatusMessage/DatasetStatusMessage'
import MintButton from 'components/ui/MintButton'
import PreReleaseModal from './ReleaseButton/PreReleaseModal'
import useModal from 'hooks/useModal/useModal'

const TopSection = styled.section`
  padding: 20px 40px;
  margin-bottom: 15px;
`
const ButtonSection = styled.div`
  margin-left: auto;
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
`
const H1 = styled.h1`
  ${({ theme }) => theme.h1};
  margin: 0;
  margin: 15px 0;
`
const ProjectName = styled.div`
  ${({ theme }) => theme.smallParagraph};
  color: ${({ theme }) => theme.darkGray};
  align-self: flex-start;

  > span {
    color: ${({ theme }) => theme.link};
  }
`

const DatasetEditor = () => {
  const dataset = useDataset()
  const project = useProject()
  const setModal = useModal()

  return (
    <>
      <TopSection>
        <TopBar>
          <BreadcrumbContainer>
            <BreadcrumbLink to={`/projects/`}>All projects</BreadcrumbLink>
            <BreadcrumbLink to={`/projects/${project.projectID}`}>
              {project.name}
            </BreadcrumbLink>
            <BreadcrumbLink
              $active
              to={`/projects/${project.projectID}/${dataset.datasetID}`}
            >
              {dataset.name}
            </BreadcrumbLink>
            <DatasetStatusMessage />
          </BreadcrumbContainer>
          <ReleaseHelpMessage />
        </TopBar>
        <TopBar>
          <div>
            <H1>{dataset ? dataset.name : 'Loading dataset'}</H1>
          </div>
          <ButtonSection>
            <ReleaseButton />
            <MintButton onClick={() => setModal(<PreReleaseModal />)}>
              Release dataset
            </MintButton>
            <DownloadButton />
          </ButtonSection>
        </TopBar>
        <TopBar>
          <ProjectName>
            Project: <span>{project.name}</span>
          </ProjectName>
          <CSVUploader />
        </TopBar>
      </TopSection>
      <DatasetGrid />
    </>
  )
}

export default DatasetEditor
