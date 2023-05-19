import React from 'react'

import { DatasetsTableRow } from './DatasetsTableRow'

import ListTable, {
  CardHeaderRow,
  HeaderRow,
  RowLink,
  TableCell,
} from 'components/ListTable/ListTable'

import useProject from 'hooks/project/useProject'
import useModal from 'hooks/useModal/useModal'
import CreateDatasetForm from '../CreateDatasetForm/CreateDatasetForm'
import CreateNewDatasetRow from './CreateNewDatasetRow'
import useDatasets from 'hooks/dataset/useDatasets'
import { datasetInitialValue } from 'reducers/stateReducer/initialValues'

const datasetPlaceholder = {
  ...datasetInitialValue,
  name: 'Loading...',
}

interface DatasetsTableProps {
  style?: React.CSSProperties
}

const DatasetsTable = ({ style }: DatasetsTableProps) => {
  const setModal = useModal()
  const project = useProject()
  const datasets = useDatasets()

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
        project.datasetIDs.map(id => ({
          ...datasetPlaceholder,
          datasetID: id,
        }))

  const wideColumnTemplate = '1.5fr 1fr 150px 220px'
  const mediumColumnTemplate = '1fr 150px 220px'

  return (
    <>
      <ListTable {...{ wideColumnTemplate, mediumColumnTemplate, style }}>
        <HeaderRow>
          <TableCell>Name</TableCell>
          <TableCell hideMedium>Collection Dates</TableCell>
          <TableCell>Status</TableCell>
          <TableCell>Last updated</TableCell>
        </HeaderRow>
        <CardHeaderRow>Datasets</CardHeaderRow>
        {sorted.map(dataset => (
          <RowLink
            key={dataset.datasetID}
            to={`/projects/${project.projectID}/${dataset.datasetID}`}
            onClick={e => {
              if (dataset.datasetID === datasetPlaceholder.datasetID) {
                e.preventDefault()
                setModal(<CreateDatasetForm />, { closeable: true })
              }
            }}
          >
            <DatasetsTableRow dataset={dataset} />
          </RowLink>
        ))}
        <CreateNewDatasetRow />
      </ListTable>
      <CardHeaderRow>Project Information</CardHeaderRow>
    </>
  )
}

export default DatasetsTable
