import React from 'react'

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
import { DatasetTopSection } from 'components/DatasetPage/DatasetPageLayout'

const DatasetEditor = () => {
  const dataset = useDataset()
  const project = useProject()

  return (
    <>
      <DatasetTopSection>
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
          <Controls>
            <PreReleaseButton />
            <DownloadButton />
            <CSVUploader />
          </Controls>
        </TopBar>
      </DatasetTopSection>

      <DatasetGrid />
    </>
  )
}

export default DatasetEditor
