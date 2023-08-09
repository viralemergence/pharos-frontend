import React, { useState } from 'react'
import styled from 'styled-components'
import { useParams } from 'react-router-dom'

import usePublishedResearchers from 'hooks/researchers/usePublishedResearchers'
import PublicViewBackground from 'components/PublicViews/PublicViewBackground'
import {
  ResearcherPageContentBox,
  ResearcherPageLayout,
  ResearcherPageMain,
} from '../ResearchersListPage/ResearcherPageLayout'
import TopBar, {
  Breadcrumbs,
  PublicViewBreadcrumbLink,
  Title,
} from 'components/layout/TopBar'
import { PublishedResearchersStatus } from 'hooks/researchers/fetchPublishedResearchers'
import ErrorBox from 'components/ui/ErrorBox'

const Container = styled.div`
  background-color: ${({ theme }) => theme.publicPagePurpleBackground};
  display: flow-root;
`
const ResearchersPage = () => {
  const { researcherID } = useParams()
  const [filters] = useState({ researcherID: [researcherID ?? ''] })
  const publishedResearchers = usePublishedResearchers({ filters })

  const researcher = publishedResearchers.all[0]

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
          {publishedResearchers.status ===
            PublishedResearchersStatus.Loading && <Title>Loading...</Title>}
          <Title>{researcher && researcher.name}</Title>
        </TopBar>
        <ResearcherPageMain>
          {publishedResearchers.status === PublishedResearchersStatus.Error && (
            <ResearcherPageContentBox>
              <h3>Error loading researchers</h3>
              <ErrorBox>{publishedResearchers.error?.message}</ErrorBox>
            </ResearcherPageContentBox>
          )}
        </ResearcherPageMain>
      </ResearcherPageLayout>
    </Container>
  )
}

export default ResearchersPage
