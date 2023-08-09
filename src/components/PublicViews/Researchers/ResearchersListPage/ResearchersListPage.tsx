import React from 'react'
import styled from 'styled-components'

import TopBar, {
  Title,
  Controls,
  Breadcrumbs,
  PublicViewBreadcrumbLink,
} from 'components/layout/TopBar'

import {
  ResearcherPageLayout,
  ResearcherPageMain,
} from './ResearcherPageLayout'

import PublicViewBackground from 'components/PublicViews/PublicViewBackground'
import LoadingSpinner from 'components/DataPage/TableView/LoadingSpinner'

import AlphabetControl from './AlphabetControl'
import SearchControl from './SearchControl'
import ResearcherBox from './ResearcherBox'

import usePublishedResearchers, {
  PublishedResearchersFilters,
} from 'hooks/researchers/usePublishedResearchers'
import { PublishedResearchersStatus } from 'hooks/researchers/fetchPublishedResearchers'

const Container = styled.div`
  background-color: ${({ theme }) => theme.publicPagePurpleBackground};
  display: flow-root;
`

const ResearchersListPage = () => {
  const [filters, setFilters] = React.useState<PublishedResearchersFilters>({})
  const publishedResearchers = usePublishedResearchers({ filters })

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
          researchers={publishedResearchers.all}
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
            <h3>
              <LoadingSpinner />
              Loading
            </h3>
          )}
        </ResearcherPageMain>
      </ResearcherPageLayout>
    </Container>
  )
}

export default ResearchersListPage
