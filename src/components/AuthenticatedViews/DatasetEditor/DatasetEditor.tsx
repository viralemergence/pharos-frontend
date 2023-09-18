import React from 'react'

import DatasetGrid from './DatasetGrid/DatasetsGrid'
import CSVUploader from './CSVParser/CSVUploader'

import TopBar, {
  Title,
  Controls,
  Breadcrumbs,
  BreadcrumbLink,
} from 'components/layout/TopBar'

import { DatasetTopSection } from 'components/DatasetPage/DatasetPageLayout'
import DatasetStatusMessage from './DatasetStatusMessage/DatasetStatusMessage'
import PreReleaseButton from './ReleaseButton/PreReleaseButton'

import MintToolbar, {
  MintToolbarButton,
  MintToolbarMore,
  MintToolbarMoreMenuButton,
} from 'components/ui/MintToolbar/MintToolbar'

import EditIcon from 'components/ui/MintToolbar/MintToolbarIcons/EditIcon'
import DeleteIcon from 'components/ui/MintToolbar/MintToolbarIcons/DeleteIcon'
import AddMoreIcon from 'components/ui/MintToolbar/MintToolbarIcons/AddMoreIcon'
import ValidateIcon from 'components/ui/MintToolbar/MintToolbarIcons/ValidateIcon'
import DownloadButton from './DownloadButton/DownloadButton'

import useModal from 'hooks/useModal/useModal'
import useProject from 'hooks/project/useProject'
import useDataset from 'hooks/dataset/useDataset'

import { DatasetReleaseStatus } from 'reducers/stateReducer/types'
import DeleteDatasetModal from './DeleteDatasetModal/DeleteDatasetModal'

const DatasetEditor = () => {
  const dataset = useDataset()
  const project = useProject()
  const setModal = useModal()

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
            <MintToolbar>
              <MintToolbarButton tooltip="Validate" disabled>
                <ValidateIcon />
              </MintToolbarButton>
              <MintToolbarButton
                tooltip="Add rows from CSV"
                onClick={() => setModal(<CSVUploader />, { closeable: true })}
                disabled={
                  dataset.releaseStatus === DatasetReleaseStatus.Published ||
                  dataset.releaseStatus === DatasetReleaseStatus.Publishing
                }
              >
                <AddMoreIcon />
              </MintToolbarButton>
              <DownloadButton />
              <MintToolbarButton tooltip="Edit dataset details" disabled>
                <EditIcon />
              </MintToolbarButton>
            </MintToolbar>
            <MintToolbarMore>
              <MintToolbarMoreMenuButton
                onClick={() =>
                  setModal(<DeleteDatasetModal />, { closeable: true })
                }
              >
                <DeleteIcon /> Delete dataset
              </MintToolbarMoreMenuButton>
            </MintToolbarMore>
          </Controls>
        </TopBar>
      </DatasetTopSection>
      <DatasetGrid />
    </>
  )
}

export default DatasetEditor
