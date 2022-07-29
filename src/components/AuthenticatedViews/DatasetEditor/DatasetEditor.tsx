import React, { useEffect } from 'react'
import styled from 'styled-components'

import MainGrid from 'components/layout/MainGrid'
import Sidebar from 'components/Sidebar/Sidebar'

import CSVParser from './CSVParser/CSVParser'
import DatasetGrid from './DatasetGrid/DatasetsGrid'
import { Content, TopBar } from '../ViewComponents'

import UpdateButton from './UpdateButton/UpdateButton'

import useDataset from 'hooks/dataset/useDataset'
import useDatasetStatusMessage from 'hooks/dataset/useDatasetStatusMessage'
import VersionSwitcher from './VersionSwitcher/VersionSwitcher'
import DownloadButton from './DownloadButton/DownloadButton'
import useLoadRegister from 'hooks/register/useLoadRegister'
import ModalMessageProvider from './DatasetGrid/ModalMessage/ModalMessageProvider'

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

  // load the register as soon as the dataset is loaded
  // and as long as the dataset has a registerKey
  useLoadRegister()

  console.log({ dataset })

  return (
    <ModalMessageProvider>
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
            <CSVParser />
            <VersionSwitcher />
          </TopBar>
          <DatasetGrid />
        </Content>
      </MainGrid>
    </ModalMessageProvider>
  )
}

export default DatasetEditor
