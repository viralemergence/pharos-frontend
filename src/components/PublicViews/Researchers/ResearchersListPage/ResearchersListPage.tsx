import TopBar, {
  Breadcrumbs,
  Controls,
  PublicViewBreadcrumbLink,
  Title,
} from 'components/layout/TopBar'
import PublicViewBackground from 'components/PublicViews/PublicViewBackground'
import React from 'react'
import styled from 'styled-components'
import AlphabetControl from './AlphabetControl'
import {
  ResearcherPageContentBox,
  ResearcherPageLayout,
  ResearcherPageMain,
} from './ResearcherPageLayout'
import SearchControl from './SearchControl'

const Container = styled.div`
  background-color: ${({ theme }) => theme.publicPagePurpleBackground};
  display: flow-root;
`

const ResearchersListPage = () => {
  return (
    <Container>
      <PublicViewBackground />
      <ResearcherPageLayout>
        <TopBar darkmode>
          <Breadcrumbs>
            <PublicViewBreadcrumbLink to={`/data/`}>
              All data
            </PublicViewBreadcrumbLink>
            <PublicViewBreadcrumbLink $active to={`/researchers/`}>
              Researchers
            </PublicViewBreadcrumbLink>
          </Breadcrumbs>
          <Title>Researchers</Title>
          <Controls>
            <SearchControl />
          </Controls>
        </TopBar>
        <AlphabetControl />
        <ResearcherPageMain>
          <ResearcherPageContentBox interactive>
            <h2>Researcher Name</h2>
          </ResearcherPageContentBox>
        </ResearcherPageMain>
      </ResearcherPageLayout>
    </Container>
  )
}

export default ResearchersListPage
