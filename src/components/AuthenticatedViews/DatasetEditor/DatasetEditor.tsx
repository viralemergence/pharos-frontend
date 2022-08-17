import React from 'react'
import styled from 'styled-components'

import Main from 'components/layout/Main'
import DatasetGrid from './DatasetGrid/DatasetsGrid'

import CSVParser from './CSVParser/CSVParser'
import { TopBar } from '../ViewComponents'

import VersionSwitcher from './VersionSwitcher/VersionSwitcher'
import DownloadButton from './DownloadButton/DownloadButton'
import ModalMessageProvider from './DatasetGrid/ModalMessage/ModalMessageProvider'
import ReleaseButton from './ReleaseButton/ReleaseButton'

import useDataset from 'hooks/dataset/useDataset'
import useDatasetStatusMessage from 'hooks/dataset/useDatasetStatusMessage'

import useAutosaveRegister from 'hooks/register/useAutosaveRegister'
import useAutosaveDataset from 'hooks/register/useAutosaveDataset'
import useLoadRegister from 'hooks/register/useLoadRegister'
import useAutosaveProject from 'hooks/project/useAutosaveProject'
import BreadcrumbLink, {
  BreadcrumbContainer,
} from 'components/ui/BreadcrumbLink'
import useProject from 'hooks/project/useProject'

const H1 = styled.h1`
  ${({ theme }) => theme.h3};
  text-transform: uppercase;
  margin: 0;
`
const H2 = styled.h2`
  ${({ theme }) => theme.extraSmallParagraph};
  text-transform: uppercase;
`

const DatasetEditor = () => {
  const dataset = useDataset()
  const datasetStatusMessage = useDatasetStatusMessage()
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
    <ModalMessageProvider>
      <Main>
        <TopBar>
          <BreadcrumbContainer>
            <BreadcrumbLink to={`/projects/`}>All projects</BreadcrumbLink>
            <BreadcrumbLink to={`/projects/${project.projectID}`}>
              {project.projectName}
            </BreadcrumbLink>
            <BreadcrumbLink
              active
              to={`/projects/${project.projectID}/${dataset.datasetID}`}
            >
              {dataset.name}
            </BreadcrumbLink>
          </BreadcrumbContainer>
        </TopBar>
        <TopBar>
          <H1>{dataset ? dataset.name : 'Loading dataset'}</H1>
          <ReleaseButton />
          <DownloadButton />
        </TopBar>
        <H2>Collected Date: {dataset && dataset.date_collected}</H2>
        <H2>{datasetStatusMessage}</H2>
        <TopBar>
          <CSVParser />
          <VersionSwitcher />
        </TopBar>
      </Main>
      <DatasetGrid />
    </ModalMessageProvider>
  )
}

export default DatasetEditor
