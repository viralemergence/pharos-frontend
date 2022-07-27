import React from 'react'
import { ProjectActions } from 'reducers/projectReducer/projectReducer'

import useDataset from 'hooks/dataset/useDataset'
import useDatasetID from 'hooks/dataset/useDatasetID'
import useProjectDispatch from 'hooks/project/useProjectDispatch'

const VersionSwitcher = () => {
  const dataset = useDataset()
  const datasetID = useDatasetID()
  const projectDispatch = useProjectDispatch()

  if (!dataset || !dataset.versions || dataset.versions.length < 2) return <></>

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
          <option key={index + version.date} value={index}>
            {version.date}
          </option>
        ))}
      </select>
    </label>
  )
}

export default VersionSwitcher
