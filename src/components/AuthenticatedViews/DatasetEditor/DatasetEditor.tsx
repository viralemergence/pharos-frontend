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
import MintToolbar, {
  MintToolbarButton,
  MintToolbarMore,
  MintToolbarMoreMenuButton,
} from 'components/ui/MintToolbar/MintToolbar'
import EditIcon from 'components/ui/MintToolbar/MintToolbarIcons/EditIcon'
import DeleteIcon from 'components/ui/MintToolbar/MintToolbarIcons/DeleteIcon'
import AddMoreIcon from 'components/ui/MintToolbar/MintToolbarIcons/AddMoreIcon'
import ValidateIcon from 'components/ui/MintToolbar/MintToolbarIcons/ValidateIcon'
import useModal from 'hooks/useModal/useModal'
import useDispatch from 'hooks/useDispatch'
import { StateActions } from 'reducers/stateReducer/stateReducer'
import getTimestamp from 'utilities/getTimestamp'
import { useNavigate } from 'react-router-dom'

const DatasetEditor = () => {
  const dataset = useDataset()
  const project = useProject()
  const setModal = useModal()
  const dispatch = useDispatch()
  const navigate = useNavigate()

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
                onClick={() => {
                  dispatch({
                    type: StateActions.DeleteDataset,
                    payload: {
                      timestamp: getTimestamp(),
                      projectID: project.projectID,
                      dataset,
                    },
                  })
                  navigate(`/projects/${project.projectID}`)
                }}
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
