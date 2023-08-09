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
import usePublishedResearchers, {
  PublishedResearchersFilters,
} from 'hooks/researchers/usePublishedResearchers'
import { PublishedResearchersStatus } from 'hooks/researchers/fetchPublishedResearchers'
import ResearcherBox from './ResearcherBox'

const Container = styled.div`
  background-color: ${({ theme }) => theme.publicPagePurpleBackground};
  display: flow-root;
`

const ResearchersListPage = () => {
  const [filters, setFilters] = React.useState<PublishedResearchersFilters>({})
  const publishedResearchers = usePublishedResearchers({ filters })

  console.log(publishedResearchers)
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
        <AlphabetControl
          filters={filters}
          setFilters={setFilters}
          researchers={
            publishedResearchers.status === PublishedResearchersStatus.Loaded
              ? publishedResearchers.data
              : []
          }
        />
        <ResearcherPageMain>
          {publishedResearchers.status === PublishedResearchersStatus.Loaded ? (
            publishedResearchers.filtered.map(researcher => (
              <ResearcherBox
                key={researcher.researcherID}
                researcher={researcher}
              />
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
