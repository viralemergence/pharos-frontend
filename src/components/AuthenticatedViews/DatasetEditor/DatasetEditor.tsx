import React from 'react'
import styled from 'styled-components'
import { useParams } from 'react-router-dom'

import { DatasetsStatus } from 'reducers/datasetsReducer/types'

import MainGrid from 'components/layout/MainGrid'
import Sidebar from 'components/Sidebar/Sidebar'

import Uploader from './Uploader/Uploader'
import DatasetGrid from './DataGrid/DataGrid'
import { Content, TopBar } from '../ViewComponents'

import useDatasets from 'hooks/useDatasets'
import UpdateButton from './UpdateButton/UpdateButton'

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
  const { id } = useParams()
  const [datasets] = useDatasets()

  if (!id) throw new Error('Missing dataset ID url parameter')
  const dataset = datasets.datasets[id]

  if (datasets.status === DatasetsStatus.Loading) return <p>Loading dataset</p>

  // const versionStatus = dataset.versions.slice(-1)[0].status

  const raw = dataset.versions.slice(-1)[0]?.raw

  console.log({ datasets })

  return (
    <MainGrid>
      <Sidebar />
      <Content>
        <TopBar>
          <H1>{dataset ? dataset.name : 'Loading dataset'}</H1>
          <UpdateButton />
        </TopBar>
        <H2>Collected Date: {dataset && dataset.date_collected}</H2>
        {(!raw || raw?.length === 0) && <Uploader />}
        <DatasetGrid {...{ raw }} />
      </Content>
    </MainGrid>
  )
}

export default DatasetEditor
