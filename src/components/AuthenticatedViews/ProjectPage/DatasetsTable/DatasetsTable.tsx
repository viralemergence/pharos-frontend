import React from 'react'

import { DatasetsTableRow } from './DatasetsTableRow'

import ListTable, {
  CardHeaderRow,
  HeaderRow,
  RowLink,
  TableCell,
} from 'components/ListTable/ListTable'

import useModal from 'hooks/useModal/useModal'
import CreateDatasetForm from '../CreateDatasetForm/CreateDatasetForm'
import CreateNewDatasetRow from './CreateNewDatasetRow'
import useDatasets from 'hooks/dataset/useDatasets'
import { datasetInitialValue } from 'reducers/stateReducer/initialValues'
import { Project } from 'reducers/stateReducer/types'

import {
  PublishedDataset,
  PublishedProject,
} from 'components/PublicViews/ProjectPage/usePublishedProject'

const datasetPlaceholder = {
  ...datasetInitialValue,
  name: 'Loading...',
}

interface UnpublishedDatasetsTableProps {
  publicView?: false
  style?: React.CSSProperties
  project: Project
  datasets: ReturnType<typeof useDatasets>
}

interface PublishedDatasetsTableProps {
  publicView: true
  style?: React.CSSProperties
  project: {
    projectID: PublishedProject['projectID']
  }
  datasets: PublishedDataset[]
}

type DatasetsTableProps =
  | UnpublishedDatasetsTableProps
  | PublishedDatasetsTableProps

const DatasetsTable = ({
  publicView,
  style,
  project,
  datasets,
}: DatasetsTableProps) => {
  const setModal = useModal()

  let datasetIDs
  if (publicView) datasetIDs = datasets.map(d => d.datasetID)
  else datasetIDs = project.datasetIDs

  // create rows for each dataset based on datasetIDs
  // using placeholder for datasets that aren't loaded
  // these links will still work since their IDs are valid
  const sorted =
    Object.keys(datasets).length > 0
      ? // if there are datasets, sort them
        Object.values(datasets).sort(
          (a, b) =>
            new Date(b.lastUpdated).getTime() -
            new Date(a.lastUpdated).getTime()
        )
      : // if there are no datasets, return placeholder
        datasetIDs.map(id => ({
          ...datasetPlaceholder,
          datasetID: id,
        }))

  // in the publicView, add one placeholder if there are no datasets
  if (publicView && sorted.length === 0) sorted.push(datasetPlaceholder)

  return (
    <>
      <CardHeaderRow>Datasets</CardHeaderRow>
      <ListTable
        wideColumnTemplate={
          publicView ? '1.5fr 220px' : '1.5fr 1fr 150px 220px'
        }
        mediumColumnTemplate={publicView ? '1fr 220px' : '1fr 150px 220px'}
        darkmode={publicView}
        style={style}
      >
        <HeaderRow>
          <TableCell>Name</TableCell>
          {!publicView && (
            <>
              <TableCell hideMedium>Collection Dates</TableCell>
              <TableCell>Status</TableCell>
            </>
          )}
          <TableCell>Last updated</TableCell>
        </HeaderRow>
        {sorted.map(dataset => (
          <RowLink
            key={dataset.datasetID}
            to={
              publicView
                ? `/${project.projectID}/${dataset.datasetID}`
                : `/projects/${project.projectID}/${dataset.datasetID}`
            }
            onClick={e => {
              if (dataset.datasetID === datasetPlaceholder.datasetID) {
                e.preventDefault()
                setModal(<CreateDatasetForm />, { closeable: true })
              }
            }}
          >
            <DatasetsTableRow dataset={dataset} publicView={publicView} />
          </RowLink>
        ))}

        {!publicView && <CreateNewDatasetRow />}
      </ListTable>
      <CardHeaderRow>Project Information</CardHeaderRow>
    </>
  )
}

export default DatasetsTable
