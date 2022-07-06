import React from 'react'
import styled from 'styled-components'

import MainGrid from 'components/layout/MainGrid'
import Sidebar from 'components/Sidebar/Sidebar'
import useDatasets from 'hooks/useDatasets'
import { useParams } from 'react-router-dom'

const Content = styled.div`
  overflow-y: scroll;
  padding: 40px;
`

const DatasetEditor = () => {
  const [datasets] = useDatasets()
  const { id } = useParams()

  if (!id) throw new Error('Missing dataset ID url parameter')

  return (
    <MainGrid>
      <Sidebar />
      <Content>
        <h1>Dataset editor</h1>
        <p>{datasets[id].name}</p>
      </Content>
    </MainGrid>
  )
}

export default DatasetEditor
