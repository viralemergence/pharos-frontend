import React from 'react'
import styled from 'styled-components'

import Sidebar from 'components/Sidebar/Sidebar'
import MainGrid from 'components/layout/MainGrid'

const Content = styled.div`
  overflow-y: scroll;
  padding: 40px;
`
const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`
const H1 = styled.h1`
  ${({ theme }) => theme.h3}
  margin: 0;
`
const NewDatasetButton = styled.button`
  ${({ theme }) => theme.smallParagraph}
  border: none;
  background: none;
  margin: 0;
  padding: 10px 20px;
  background-color: ${({ theme }) => theme.mint};
`

const ResearcherHome = () => {
  return (
    <MainGrid>
      <Sidebar />
      <Content>
        <TopBar>
          <H1>My Datasets</H1>
          <NewDatasetButton>+ New Dataset</NewDatasetButton>
        </TopBar>
      </Content>
    </MainGrid>
  )
}

export default ResearcherHome
