import React from 'react'
import styled from 'styled-components'

import DatasetGrid from './DatasetGrid/DatasetsGrid'

import CSVParser from './CSVParser/CSVParser'
import { TopBar } from '../ViewComponents'

import VersionSwitcher from './VersionSwitcher/VersionSwitcher'
import DownloadButton from './DownloadButton/DownloadButton'
import ReleaseButton from './ReleaseButton/ReleaseButton'
import ReleaseHelpMessage from './ReleaseHelpMessage/ReleaseHelpMessage'

import useDataset from 'hooks/dataset/useDataset'

import useAutosaveRegister from 'hooks/register/useAutosaveRegister'
import useAutosaveDataset from 'hooks/register/useAutosaveDataset'
import useLoadRegister from 'hooks/register/useLoadRegister'
import useAutosaveProject from 'hooks/project/useAutosaveProject'
import BreadcrumbLink, {
  BreadcrumbContainer,
} from 'components/ui/BreadcrumbLink'
import useProject from 'hooks/project/useProject'
import DatasetStatusMessage from './DatasetStatusMessage/DatasetStatusMessage'

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

  console.log({ project })

  // Handling server status side effects

  // load the register as soon as the dataset is loaded
  // and as long as the dataset has a registerKey
  useLoadRegister()
  // autosave dataset when changes are committed
  // this saves everything in the dataset object
  // except for the register itself
  useAutosaveDataset()
  // autosave the register when changes are committed
  // this saves both the versions array and the register
  useAutosaveRegister()

  useAutosaveProject()

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
              active
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
            <VersionSwitcher />
            <ReleaseButton />
            <DownloadButton />
          </ButtonSection>
        </TopBar>
        <TopBar>
          <ProjectName>
            Project: <span>{project.name}</span>
          </ProjectName>
          <CSVParser />
        </TopBar>
      </TopSection>
      <DatasetGrid />
    </>
  )
}

export default DatasetEditor
