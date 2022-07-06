import React from 'react'
import styled from 'styled-components'

import MainGrid from 'components/layout/MainGrid'
import Sidebar from 'components/Sidebar/Sidebar'

const Content = styled.div`
  overflow-y: scroll;
  padding: 40px;
`

const DatasetEditor = () => {
  return (
    <MainGrid>
      <Sidebar />
      <Content>
        <h1>Dataset editor</h1>
      </Content>
    </MainGrid>
  )
}

export default DatasetEditor
