import React from 'react'
import styled from 'styled-components'

import useUser from 'hooks/useUser'
import Sidebar from 'components/Sidebar/Sidebar'
import MainGrid from 'components/layout/MainGrid'

const Content = styled.div`
  overflow-y: scroll;
  padding: 15px;
`

const ResearcherHome = () => {
  const [user] = useUser()

  return (
    <MainGrid>
      <Sidebar />
      <Content>
        <h1>Researcher Home</h1>
      </Content>
    </MainGrid>
  )
}

export default ResearcherHome
