import React from 'react'
import styled from 'styled-components'

import DatasetGrid from './DatasetGrid/DatasetsGrid'
import CSVUploader from './CSVParser/CSVUploader'

import TopBar, {
  Title,
  Controls,
  Breadcrumbs,
  BreadcrumbLink,
} from 'components/layout/TopBar'

import DownloadButton from './DownloadButton/DownloadButton'

import useDataset from 'hooks/dataset/useDataset'

import DatasetStatusMessage from './DatasetStatusMessage/DatasetStatusMessage'
import PreReleaseButton from './ReleaseButton/PreReleaseButton'

import useProject from 'hooks/project/useProject'

const TopSection = styled.section`
  padding: 20px 40px;
  margin-bottom: 15px;
`

const DatasetControls = styled(Controls)`
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
`

const DatasetEditor = () => {
  const dataset = useDataset()
  const project = useProject()

  return (
    <>
      <TopSection>
        <TopBar>
          <Breadcrumbs>
            <BreadcrumbLink to={`/projects/`}>All projects</BreadcrumbLink>
            <BreadcrumbLink to={`/projects/${project.projectID}`}>
              {project.name}
            </BreadcrumbLink>
            <BreadcrumbLink
              $active
              to={`/projects/${project.projectID}/${dataset.datasetID}`}
            >
              {dataset.name}
            </BreadcrumbLink>
            <DatasetStatusMessage />
          </Breadcrumbs>
          <Title>{dataset ? dataset.name : 'Loading dataset'}</Title>
          <DatasetControls>
            <PreReleaseButton />
            <DownloadButton />
            <CSVUploader />
          </DatasetControls>
        </TopBar>
      </TopSection>

      <DatasetGrid />
    </>
  )
}

export default DatasetEditor
