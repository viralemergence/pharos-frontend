import React from 'react'
import { ProjectActions } from 'reducers/projectReducer/projectReducer'

import useProject from 'hooks/useProject'
import useDataset from 'hooks/useDataset'
import useDatasetID from 'hooks/useDatasetID'

const VersionSwitcher = () => {
  const [, projectDispatch] = useProject()
  const datasetID = useDatasetID()
  const dataset = useDataset()

  if (
    !datasetID ||
    !dataset ||
    !dataset.versions ||
    dataset.versions.length < 2
  )
    return <></>

  const onSelectVersion = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextVersion = e.target.value

    projectDispatch({
      type: ProjectActions.SetActiveVersion,
      payload: { datasetID: datasetID, version: Number(nextVersion) },
    })
  }

  return (
    <label>
      Select version:{' '}
      <select
        onChange={onSelectVersion}
        value={dataset.activeVersion}
        style={{ marginLeft: '1ex' }}
      >
        {dataset.versions.map((version, index) => (
          <option key={version.date} value={index}>
            {version.date}
          </option>
        ))}
      </select>
    </label>
  )
}

export default VersionSwitcher
