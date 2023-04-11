import React from 'react'

import { DatasetsTableRow } from './DatasetsTableRow'
import ListTable, { HeaderRow, RowLink } from 'components/ListTable/ListTable'

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

const DatasetsTable = () => {
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

  return (
    <ListTable columnTemplate="2fr repeat(3, 1fr)">
      <HeaderRow>
        <div>Name</div>
        <div>Collection Dates</div>
        <div>Status</div>
        <div>Last updated</div>
      </HeaderRow>
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
  )
}

export default DatasetsTable
