import React from 'react'

import { DatasetsTableRow } from './DatasetsTableRow'
import ListTable, { HeaderRow, RowLink } from 'components/ListTable/ListTable'

import useProject from 'hooks/project/useProject'
import useProjectID from 'hooks/project/useProjectID'
import { ProjectStatus } from 'reducers/projectReducer/types'
import useModal from 'hooks/useModal/useModal'
import CreateDatasetForm from '../CreateDatasetForm/CreateDatasetForm'

const datasetPlaceholder = {
  datasetID: '',
  researcherID: '',
  versions: [],
  highestVersion: 0,
  activeVersion: 0,
  name: '—',
}

const DatasetsTable = () => {
  const projectID = useProjectID()
  const project = useProject()
  const setModal = useModal()

  // create rows for each dataset based on datasetIDs
  // using placeholder for datasets that aren't loaded
  // these links will still work since their IDs are valid
  let sorted =
    Object.keys(project.datasets).length > 0
      ? Object.values(project.datasets)
      : project.datasetIDs.map(id => ({
          ...datasetPlaceholder,
          datasetID: id,
          name: 'Loading...',
        }))

  const loading =
    project.status === ProjectStatus.Initial ||
    project.status === ProjectStatus.Loading

  // if we end up still having no rows to show, show a loading
  // placeholder if the project is loading or a full placeholder
  // if the project is loaded and the project has no datasets
  if (sorted.length === 0)
    sorted = [
      {
        ...datasetPlaceholder,
        name: loading ? 'Loading...' : datasetPlaceholder.name,
      },
    ]

  Object.values(project.datasets).sort((a, b) => {
    if (!a.versions || !b.versions) return 0
    if (a.versions.length !== 0 || b.versions.length !== 0) return 0
    if (!a.versions.slice(-1)[0]?.date) return 0
    if (!b.versions.slice(-1)[0]?.date) return 0

    return (
      new Date(b.versions.slice(-1)[0].date!).getTime() -
      new Date(a.versions.slice(-1)[0].date!).getTime()
    )
  })

  return (
    <ListTable columnTemplate="repeat(4, 1.5fr)">
      <HeaderRow>
        <div>Name</div>
        <div>Collection Dates</div>
        <div>Status</div>
        <div>Last updated</div>
      </HeaderRow>
      {sorted.map(dataset => (
        <RowLink
          key={dataset.datasetID}
          to={`/projects/${projectID}/${dataset.datasetID}`}
          onClick={e => {
            if (dataset.datasetID === datasetPlaceholder.datasetID) {
              e.preventDefault()
              setModal(<CreateDatasetForm />, { closeable: true })
            }
          }}
        >
          <DatasetsTableRow key={dataset.datasetID} dataset={dataset} />
        </RowLink>
      ))}
    </ListTable>
  )
}

export default DatasetsTable
