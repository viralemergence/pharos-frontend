import CMS from '@talus-analytics/library.airtable-cms'
import NavBar from 'components/layout/NavBar/NavBar'
import Providers from 'components/layout/Providers'
import TopBar, { Breadcrumbs, Controls, Title } from 'components/layout/TopBar'
import {
  ProjectPageLayout,
  ProjectPageMain,
  ProjectPageSidebar,
} from 'components/ProjectPage/ProjectPageLayout'
import useDownloadMetadata, {
  DataDownloadMetadataStatus,
} from 'components/PublicViews/DownloadPage/useDownloadMetadata'
import { PublicProjectPageContentBox } from 'components/PublicViews/ProjectPage/ProjectPage'
import PublicViewBackground from 'components/PublicViews/PublicViewBackground'
import ClickToCopy from 'components/ui/ClickToCopy'
import { MintButtonExternalLink } from 'components/ui/MintButton'
import { Link, navigate } from 'gatsby'
import ModalMessageProvider from 'hooks/useModal/ModalMessageProvider'
import { lighten, saturate } from 'polished'
import React from 'react'
import styled from 'styled-components'

const StyledLink = styled(Link)`
  color: ${({ theme }) => theme.link};
`

const Container = styled.div`
  background-color: ${({ theme }) => theme.publicPagePurpleBackground};
  display: flow-root;
`

const DownloadPageLayout = styled(ProjectPageLayout)`
  gap: 60px;
  h1 {
    color: ${({ theme }) => theme.white};
  }
  h2 {
    color: ${({ theme }) => theme.white};
  }
`

const DownloadPageContentBox = styled(PublicProjectPageContentBox)`
  background: none;
  border: none;
  padding: 0px;

  &:before {
    content: unset;
  }

  a {
    color: ${({ theme }) => theme.mint};
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`

const AppliedFilters = styled.div`
  margin-top: 15px;
  color: ${({ theme }) => theme.white};
  display: flex;
  flex-direction: column;
  gap: 10px;
  // background: ${({ theme }) => theme.mutedPurple1};
  // border: 1px solid
  //   ${({ theme }) => saturate(0.1, lighten(-0.08, theme.mutedPurple1))};
  // padding: 10px;
  border-radius: 10px;
`

const Filter = styled.div`
  background: ${({ theme }) => lighten(-0.02, theme.mutedPurple1)};
  border: 1px solid
    ${({ theme }) => saturate(0.1, lighten(-0.11, theme.mutedPurple1))};
  ${({ theme }) => theme.smallParagraph};
  display: flex;
  flex-direction: column;
  padding: 5px 13px 10px 13px;
  border-radius: 5px;

  &:before {
    ${({ theme }) => theme.smallParagraph};
    color: ${({ theme }) => lighten(0.1, saturate(-0.03, theme.mutedPurple4))};
    font-style: italic;
    content: 'AND';
    font-size: 0.9em;
  }

  &:first-of-type:before {
    content: '';
    display: none;
  }
`

const Label = styled.span`
  margin-bottom: 8px;
`

const Value = styled.div`
  position: relative;
  border-left: 1px solid ${({ theme }) => theme.mutedPurple3};
  margin-left: 5em;
  padding: 0px 8px 3px 8px;
  display: flex;
  align-items: baseline;

  &:before {
    content: 'OR';
    position: absolute;
    left: -9px;
    transform: translateX(-100%);
    color: ${({ theme }) => lighten(0.1, saturate(-0.03, theme.mutedPurple4))};
    ${({ theme }) => theme.smallParagraph};
    font-size: 0.9em;
    font-style: italic;
  }

  &:first-of-type {
    // margin-top: 5px;
  }

  &:first-of-type:before {
    content: 'MATCH';
  }
`

const DateFilter = styled(Filter)``

const DateRow = styled.div`
  display: flex;
  flex-direction: row;
  // justify-content: space-between;
  gap: 3em;
  @media (max-width: 1300px) {
    justify-content: flex-start;
    gap: 10px;
  }
`

const DateValue = styled(Value)`
  flex-direction: column;
  border-left: none;
  margin-left: 0;
  margin-top: 1em;
  padding-left: 0;
  padding-right: 0;

  &:before {
    top: 3px;
    left: unset;
    bottom: unset;
    transform: translateY(-100%);
    content: 'TO';
  }

  &:first-of-type:before {
    content: 'FROM';
  }
`

const Downloads = () => {
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search)
    const downloadID = params.get('dwn')
    if (!downloadID) navigate('/')
  }

  const { status, data: downloadMetadata } = useDownloadMetadata()

  const appliedFilters: { [key: string]: string[] } = {}
  if (status === DataDownloadMetadataStatus.Loaded)
    for (const [filter, selected] of Object.entries(
      downloadMetadata.queryStringParameters
    )) {
      if (selected !== null) appliedFilters[filter] = selected
    }

  const location: typeof window.location | Record<string, undefined> =
    typeof window !== 'undefined' ? window.location : {}

  const permanentPrettyLink = `${location.host}${location.pathname}${location.search}`

  const yearDownloaded =
    status === DataDownloadMetadataStatus.Loaded &&
    new Date(downloadMetadata.downloadDate).getFullYear().toString()

  const formattedDate = new Date()
    .toISOString()
    .split('.')[0]
    .split('T')
    .join(' ')

  const citationToCopy = `PHAROS (${yearDownloaded}). ${permanentPrettyLink}. Accessed on ${formattedDate} UTC.`

  return (
    <Providers>
      <CMS.SEO />
      <React.StrictMode>
        <NavBar />
        <ModalMessageProvider>
          <PublicViewBackground />
          <Container>
            <DownloadPageLayout>
              <TopBar darkmode>
                <Breadcrumbs />
                <Title>
                  {status === DataDownloadMetadataStatus.Loaded
                    ? `PHAROS data extract ${
                        new Date(downloadMetadata.downloadDate)
                          .toISOString()
                          .split('T')[0]
                      }`
                    : 'Loading...'}{' '}
                </Title>
                <Controls>
                  {status === DataDownloadMetadataStatus.Loaded && (
                    <MintButtonExternalLink
                      href={downloadMetadata.accessLink}
                      download={`Pharos data extract ${formattedDate}`}
                      target="_blank"
                    >
                      Download data extract
                    </MintButtonExternalLink>
                  )}
                </Controls>
              </TopBar>
              {status === DataDownloadMetadataStatus.Loaded && (
                <>
                  <ProjectPageMain>
                    <DownloadPageContentBox>
                      <h2>Downloaded on: {downloadMetadata.downloadDate}</h2>
                      <h2>Cite data extract</h2>
                      <ClickToCopy
                        darkmode
                        style={{ marginTop: 10, width: 'fit-content' }}
                        copyContentString={citationToCopy}
                      >
                        {citationToCopy}
                      </ClickToCopy>
                      <h2>Permanent data extract link</h2>
                      <ClickToCopy
                        darkmode
                        copyContentString={location.href ?? ''}
                        style={{ marginTop: 10, width: 'fit-content' }}
                      >
                        {permanentPrettyLink}
                      </ClickToCopy>
                      <h2>
                        Researchers included in extract (
                        {downloadMetadata.researchers.length})
                      </h2>
                      <ul>
                        {downloadMetadata.researchers.map(researcher => (
                          <li key={researcher.researcherID}>
                            <StyledLink
                              to={`/researchers/?researcherID=${researcher.researcherID}`}
                            >
                              {researcher.name}
                            </StyledLink>
                          </li>
                        ))}
                      </ul>
                      <h2>
                        Projects included in extract (
                        {downloadMetadata.projects.length})
                      </h2>
                      <ul>
                        {downloadMetadata.projects.map(project => (
                          <li key={project.projectID}>
                            <StyledLink
                              to={`/projects/?prj=${project.projectID}`}
                            >
                              {project.name}
                            </StyledLink>
                          </li>
                        ))}
                      </ul>
                    </DownloadPageContentBox>
                  </ProjectPageMain>
                  <ProjectPageSidebar>
                    <DownloadPageContentBox>
                      {Object.keys(appliedFilters).length > 0 && (
                        <>
                          {console.log(appliedFilters)}
                          <h2>Applied Filters</h2>
                          <AppliedFilters>
                            {(appliedFilters.collection_start_date ||
                              appliedFilters.collection_end_date) && (
                              <DateFilter>
                                <Label>Collection date</Label>
                                <DateRow>
                                  <DateValue>
                                    {appliedFilters.collection_start_date ||
                                      'Any'}
                                  </DateValue>
                                  <DateValue>
                                    {appliedFilters.collection_end_date ||
                                      'Any'}
                                  </DateValue>
                                </DateRow>
                              </DateFilter>
                            )}
                            {Object.entries(appliedFilters)
                              .filter(
                                ([key, _]) =>
                                  ![
                                    'collection_start_date',
                                    'collection_end_date',
                                  ].includes(key)
                              )
                              .map(([filter, values]) => (
                                <Filter>
                                  <Label>{filter}</Label>
                                  {values.map(value => (
                                    <Value>{value}</Value>
                                  ))}
                                </Filter>
                              ))}
                          </AppliedFilters>
                        </>
                      )}
                    </DownloadPageContentBox>
                  </ProjectPageSidebar>
                </>
              )}
            </DownloadPageLayout>
          </Container>
        </ModalMessageProvider>
      </React.StrictMode>
    </Providers>
  )
}

export default Downloads
