import CMS from '@talus-analytics/library.airtable-cms'
import NavBar from 'components/layout/NavBar/NavBar'
import Providers from 'components/layout/Providers'
import TopBar, { Breadcrumbs, Controls, Title } from 'components/layout/TopBar'
import {
  ProjectPageContentBox,
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
import { MintButtonLink } from 'components/ui/MintButton'
import { Link, navigate } from 'gatsby'
import ModalMessageProvider from 'hooks/useModal/ModalMessageProvider'
import React from 'react'
import styled from 'styled-components'
import { visitIterationBody } from 'typescript/lib/tsserverlibrary'

const StyledLink = styled(Link)`
  color: ${({ theme }) => theme.link};
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

  const citationToCopy = `PHAROS (${yearDownloaded}). ${permanentPrettyLink}. Accessed on ${new Date()
    .toISOString()
    .split('.')[0]
    .split('T')
    .join(' ')} UTC.`

  return (
    <Providers>
      <CMS.SEO />
      <React.StrictMode>
        <NavBar />
        <ModalMessageProvider>
          <PublicViewBackground />
          <ProjectPageLayout>
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
                  <MintButtonLink to={downloadMetadata.accessLink}>
                    Download data extract
                  </MintButtonLink>
                )}
              </Controls>
            </TopBar>
            {status === DataDownloadMetadataStatus.Loaded && (
              <>
                <ProjectPageMain>
                  <PublicProjectPageContentBox>
                    <h2>Downloaded on: {downloadMetadata.downloadDate}</h2>
                    <h2>Cite data extract</h2>
                    <ClickToCopy
                      darkmode
                      style={{ marginTop: 10 }}
                      copyContentString={citationToCopy}
                    >
                      {citationToCopy}
                    </ClickToCopy>
                    <h2>Permanent data extract link</h2>
                    <ClickToCopy
                      darkmode
                      copyContentString={location.href ?? ''}
                      style={{ marginTop: 10 }}
                    >
                      {permanentPrettyLink}
                    </ClickToCopy>
                    <h2>Researchers included in extract</h2>
                    <ul>
                      {downloadMetadata.researchers.map(researcher => (
                        <li key={researcher.researcherID}>
                          <StyledLink to={`researchers/`}>
                            {researcher.name}
                          </StyledLink>
                        </li>
                      ))}
                    </ul>
                    <h2>Projects included in extract</h2>
                    <ul>
                      {downloadMetadata.projects.map(project => (
                        <li key={project.projectID}>
                          <StyledLink to={`researchers/`}>
                            {project.name}
                          </StyledLink>
                        </li>
                      ))}
                    </ul>
                  </PublicProjectPageContentBox>
                </ProjectPageMain>
                <ProjectPageSidebar>
                  <PublicProjectPageContentBox>
                    <h2>Applied Filters</h2>
                    <pre>{JSON.stringify(appliedFilters, null, 2)}</pre>
                  </PublicProjectPageContentBox>
                </ProjectPageSidebar>
              </>
            )}
          </ProjectPageLayout>
        </ModalMessageProvider>
      </React.StrictMode>
    </Providers>
  )
}

export default Downloads
