import React, { useEffect } from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'

import { ProjectStatus } from 'reducers/projectReducer/types'

import MainGrid from 'components/layout/MainGrid'
import Sidebar from 'components/Sidebar/Sidebar'

import Uploader from './Uploader/Uploader'
import DatasetGrid from './DatasetGrid/DatasetsGrid'
import { Content, TopBar } from '../ViewComponents'

import useProject from 'hooks/project/useProject'
import UpdateButton from './UpdateButton/UpdateButton'

import useDataset from 'hooks/useDataset'
import useDatasetStatusMessage from 'hooks/useDatasetStatusMessage'
import VersionSwitcher from './VersionSwitcher/VersionSwitcher'
import DownloadButton from './DownloadButton/DownloadButton'

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
  const navigate = useNavigate()
  const [project] = useProject()

  console.log({ project })

  const dataset = useDataset()
  const datasetStatusMessage = useDatasetStatusMessage()

  // handle case where the page loads on a dataset that doesn't exist
  useEffect(() => {
    if (project.status === ProjectStatus.Loaded && !dataset) navigate('/')
  }, [project.status, dataset, navigate])

  return (
    <MainGrid>
      <Sidebar />
      <Content>
        <TopBar>
          <H1>{dataset ? dataset.name : 'Loading dataset'}</H1>
          <UpdateButton />
          <DownloadButton />
        </TopBar>
        <H2>Collected Date: {dataset && dataset.date_collected}</H2>
        <H2>{datasetStatusMessage}</H2>
        <TopBar>
          <Uploader />
          <VersionSwitcher />
        </TopBar>
        <DatasetGrid />
      </Content>
    </MainGrid>
  )
}

export default DatasetEditor
