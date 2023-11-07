import React, { useState } from 'react'
import styled, { useTheme } from 'styled-components'

import PublicViewBackground from '../PublicViewBackground'
import { DatasetTopSection } from 'components/DatasetPage/DatasetPageLayout'
import type { Sort } from 'components/PublicViews/PublishedRecordsDataGrid/PublishedRecordsDataGrid'

import TopBar, {
  Title,
  Breadcrumbs,
  PublicViewBreadcrumbLink,
  // BreadcrumbLink,
  Controls,
} from 'components/layout/TopBar'

import { UserStatus } from 'reducers/stateReducer/types'
import { MintButtonLink } from 'components/ui/MintButton'
import PublishedRecordsDataGrid from '../PublishedRecordsDataGrid/PublishedRecordsDataGrid'

import useAppState from 'hooks/useAppState'
import usePublishedProject, {
  ProjectDataStatus,
} from '../ProjectPage/usePublishedProject'
import usePublishedRecords from 'hooks/publishedRecords/usePublishedRecords'
import usePublishedRecordsMetadata from 'hooks/publishedRecords/usePublishedRecordsMetadata'
import { PublicProjectPageContentBox } from '../ProjectPage/ProjectPage'
import type { SimpleFilter } from 'pages/data'

const GridContainer = styled.div`
  height: calc(100vh - 265px);
  height: calc(100svh - 265px);
  margin: 0 40px;
`

const HIDDEN_FIELDS = ['Project']
const PAGESIZE = 50

const DatasetPage = () => {
  const theme = useTheme()

  const params =
    typeof window !== 'undefined'
      ? new URLSearchParams(window.location.search)
      : new URLSearchParams('')

  const datasetID = params.get('set') ?? ''

  const { status, data: project } = usePublishedProject()
  const { user } = useAppState()

  const [filters] = useState<SimpleFilter[]>(() => [
    { id: 'dataset_id', values: [datasetID] },
  ])
  const [sorts, setSorts] = useState<Sort[]>([])

  const [publishedRecordsData, loadMore] = usePublishedRecords({
    pageSize: PAGESIZE,
    filters,
    sorts,
  })

  const dataset =
    status === ProjectDataStatus.Loaded &&
    project.datasets.find(dataset => dataset.datasetID === datasetID)

  const { sortableFields } = usePublishedRecordsMetadata() ?? {}

  if (
    status === ProjectDataStatus.Error ||
    (status === ProjectDataStatus.Loaded && !dataset)
  ) {
    return (
      <>
        <PublicViewBackground />
        <DatasetTopSection>
          <TopBar darkmode>
            <Breadcrumbs>
              <PublicViewBreadcrumbLink to={`/data/`}>
                All data
              </PublicViewBreadcrumbLink>
              <PublicViewBreadcrumbLink to={`/data/`}>
                Projects
              </PublicViewBreadcrumbLink>
              {status === ProjectDataStatus.Loaded && (
                <PublicViewBreadcrumbLink
                  style={{ color: theme.white }}
                  $active
                  to={`/projects/?prj=${project.projectID}`}
                >
                  {status === ProjectDataStatus.Loaded
                    ? project.name
                    : 'Loading...'}
                </PublicViewBreadcrumbLink>
              )}
            </Breadcrumbs>
            <Title>Dataset not found</Title>
          </TopBar>
          <PublicProjectPageContentBox style={{ marginTop: 30 }}>
            <h2>Error message</h2>
            {status === ProjectDataStatus.Error && (
              <pre style={{ color: 'white' }}>{project.error.message}</pre>
            )}
            {status === ProjectDataStatus.Loaded && (
              <pre style={{ color: 'white' }}>
                {`Dataset with ID ${datasetID} not found in project ${project.name}`}
              </pre>
            )}
          </PublicProjectPageContentBox>
        </DatasetTopSection>
      </>
    )
  }

  return (
    <>
      <PublicViewBackground />
      <DatasetTopSection>
        <TopBar darkmode>
          <Breadcrumbs>
            <PublicViewBreadcrumbLink to={`/data/`}>
              All data
            </PublicViewBreadcrumbLink>
            <PublicViewBreadcrumbLink to={`/data/`}>
              Projects
            </PublicViewBreadcrumbLink>
            <PublicViewBreadcrumbLink
              style={{ color: theme.white }}
              $active
              to={`/projects/?prj=${project.projectID}`}
            >
              {status === ProjectDataStatus.Loaded
                ? project.name
                : 'Loading...'}
            </PublicViewBreadcrumbLink>
            <PublicViewBreadcrumbLink
              $active
              to={`/projects/?prj=${project.projectID}&set=${datasetID}`}
            >
              {dataset ? dataset.name : 'Loading...'}
            </PublicViewBreadcrumbLink>
          </Breadcrumbs>
          <Title>{dataset ? dataset.name : 'Loading...'}</Title>
          <Controls>
            {user.status === UserStatus.LoggedIn &&
              user.data?.projectIDs?.includes(project.projectID) && (
                <MintButtonLink
                  to={`/app/#/projects/${project.projectID}/${datasetID}`}
                >
                  Manage dataset
                </MintButtonLink>
              )}
          </Controls>
        </TopBar>
      </DatasetTopSection>
      <GridContainer>
        <PublishedRecordsDataGrid
          publishedRecordsData={publishedRecordsData}
          hiddenFields={HIDDEN_FIELDS}
          loadMore={loadMore}
          sortableFields={sortableFields}
          sorts={sorts}
          setSorts={setSorts}
        />
      </GridContainer>
    </>
  )
}

export default DatasetPage
