import React from 'react'
import styled from 'styled-components'

import MainGrid from 'components/layout/MainGrid'
import Sidebar from 'components/Sidebar/Sidebar'
import useDatasets from 'hooks/useDatasets'
import { useParams } from 'react-router-dom'
import { Content, TopBar } from '../ViewComponents'
import MintButton from 'components/ui/MintButton'

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
  const [datasets] = useDatasets()
  const { id } = useParams()

  if (!id) throw new Error('Missing dataset ID url parameter')

  const dataset = datasets[id]

  return (
    <MainGrid>
      <Sidebar />
      <Content>
        <TopBar>
          <H1>{dataset ? dataset.name : 'Loading dataset'}</H1>
          <MintButton>Update Dataset</MintButton>
        </TopBar>
        <H2>Collected Date: {dataset && dataset.date_collected}</H2>
      </Content>
    </MainGrid>
  )
}

export default DatasetEditor
