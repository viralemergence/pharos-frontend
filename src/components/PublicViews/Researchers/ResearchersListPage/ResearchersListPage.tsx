import React from 'react'
import styled from 'styled-components'

import TopBar, {
  Breadcrumbs,
  Controls,
  PublicViewBreadcrumbLink,
  Title,
} from 'components/layout/TopBar'

import PublicViewBackground from 'components/PublicViews/PublicViewBackground'
import AlphabetControl from './AlphabetControl'

import {
  ResearcherPageLayout,
  ResearcherPageMain,
} from './ResearcherPageLayout'

import SearchControl from './SearchControl'
import usePublishedResearchers from 'hooks/researchers/usePublishedResearchers'
import { PublishedResearchersStatus } from 'hooks/researchers/fetchPublishedResearchers'
import ResearcherBox from './ResearcherBox'

const Container = styled.div`
  background-color: ${({ theme }) => theme.publicPagePurpleBackground};
  display: flow-root;
`

const ResearchersListPage = () => {
  const publishedResearchers = usePublishedResearchers({})

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
          {publishedResearchers.status === PublishedResearchersStatus.Loaded ? (
            publishedResearchers.data.map(researcher => (
              <ResearcherBox researcher={researcher} />
            ))
          ) : (
            <h3>Loading</h3>
          )}
        </ResearcherPageMain>
      </ResearcherPageLayout>
    </Container>
  )
}

export default ResearchersListPage
