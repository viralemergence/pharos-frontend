import React from 'react'
import styled from 'styled-components'

import TopBar, {
  Title,
  Controls,
  Breadcrumbs,
  PublicViewBreadcrumbLink,
} from 'components/layout/TopBar'

import ErrorBox from 'components/ui/ErrorBox'
import LoadingSpinner from 'components/DataPage/TableView/LoadingSpinner'
import PublicViewBackground from 'components/PublicViews/PublicViewBackground'

import {
  ResearcherPageMain,
  ResearcherPageLayout,
  ResearcherPageContentBox,
} from './ResearcherPageLayout'

import SearchControl from './SearchControl'
import ResearcherBox from './ResearcherBox'
import AlphabetControl from './AlphabetControl'

import usePublishedResearchers, {
  PublishedResearchersFilters,
} from 'hooks/researchers/usePublishedResearchers'
import { PublishedResearchersStatus } from 'hooks/researchers/fetchPublishedResearchers'

const Container = styled.div`
  background-color: ${({ theme }) => theme.publicPagePurpleBackground};
  display: flow-root;
`
const LoadingSpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  ${({ theme }) => theme.bigParagraph};
  color: ${({ theme }) => theme.white};
`

const ResearchersListPage = () => {
  const [filters, setFilters] = React.useState<PublishedResearchersFilters>({
    searchString: '',
  })
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
            <SearchControl filters={filters} setFilters={setFilters} />
          </Controls>
        </TopBar>
        <AlphabetControl
          filters={filters}
          setFilters={setFilters}
          researchers={publishedResearchers.all}
        />
        <ResearcherPageMain>
          {publishedResearchers.status === PublishedResearchersStatus.Error && (
            <ResearcherPageContentBox>
              <h3>Error loading researchers</h3>
              <ErrorBox>{publishedResearchers.error?.message}</ErrorBox>
            </ResearcherPageContentBox>
          )}
          {publishedResearchers.status === PublishedResearchersStatus.Loaded &&
            publishedResearchers.filtered.map(researcher => (
              <ResearcherBox
                key={researcher.researcherID}
                researcher={researcher}
              />
            ))}
          {publishedResearchers.status ===
            PublishedResearchersStatus.Loading && (
            <LoadingSpinnerContainer>
              <LoadingSpinner style={{ marginRight: 5 }} />
              Loading
            </LoadingSpinnerContainer>
          )}
        </ResearcherPageMain>
      </ResearcherPageLayout>
    </Container>
  )
}

export default ResearchersListPage
