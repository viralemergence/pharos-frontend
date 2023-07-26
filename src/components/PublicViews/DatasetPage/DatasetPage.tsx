import React from 'react'
import styled, { useTheme } from 'styled-components'

import PublicViewBackground from '../PublicViewBackground'
import { DatasetTopSection } from 'components/DatasetPage/DatasetPageLayout'

import useDatasetID from 'hooks/dataset/useDatasetID'

import TopBar, {
  Title,
  Breadcrumbs,
  PublicViewBreadcrumbLink,
  BreadcrumbLink,
  Controls,
} from 'components/layout/TopBar'

import {
  ProjectPageMain,
  ProjectPageContentBox,
} from 'components/ProjectPage/ProjectPageLayout'

import useAppState from 'hooks/useAppState'
import usePublishedProject, {
  ProjectDataStatus,
} from '../ProjectPage/usePublishedProject'
import { UserStatus } from 'reducers/stateReducer/types'
import { MintButtonLink } from 'components/ui/MintButton'

const Container = styled.div`
  background-color: ${({ theme }) => theme.lightBlack};
  display: flow-root;
`
const ErrorMessageBox = styled(ProjectPageContentBox)`
  position: relative;
  margin-top: 40px;
  background-color: ${({ theme }) => theme.medDarkBlack};
  border-top: thin solid ${({ theme }) => theme.mint};
  color: ${({ theme }) => theme.white};

  > h2 {
    color: ${({ theme }) => theme.medDarkGray};
  }
`

const DatasetPage = () => {
  const datasetID = useDatasetID()
  const { status, data: project } = usePublishedProject()
  const { user } = useAppState()
  const theme = useTheme()

  const dataset =
    status === ProjectDataStatus.Loaded &&
    project.datasets.find(dataset => dataset.datasetID === datasetID)

  if (
    status === ProjectDataStatus.Error ||
    (status === ProjectDataStatus.Loaded && !dataset)
  ) {
    return (
      <Container>
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
            </Breadcrumbs>
            <Title>Dataset not found</Title>
          </TopBar>
          <ErrorMessageBox>
            <h2>Error message</h2>
            {status === ProjectDataStatus.Error && (
              <pre style={{ color: 'white' }}>{project.error.message}</pre>
            )}
            {status === ProjectDataStatus.Loaded && (
              <pre style={{ color: 'white' }}>
                {`Dataset with ID ${datasetID} not found in project ${project.name}`}
              </pre>
            )}
          </ErrorMessageBox>
        </DatasetTopSection>
      </Container>
    )
  }

  return (
    <Container>
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
            <BreadcrumbLink
              style={{ color: theme.white }}
              $active
              to={`/${project.projectID}`}
            >
              {status === ProjectDataStatus.Loaded
                ? project.name
                : 'Loading...'}
            </BreadcrumbLink>
            <BreadcrumbLink $active to={`/${project.projectID}/${datasetID}`}>
              {dataset ? dataset.name : 'Loading...'}
            </BreadcrumbLink>
          </Breadcrumbs>
          <Title>{dataset ? dataset.name : 'Loading...'}</Title>
          <Controls>
            {user.status === UserStatus.loggedIn &&
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
    </Container>
  )
}

export default DatasetPage
