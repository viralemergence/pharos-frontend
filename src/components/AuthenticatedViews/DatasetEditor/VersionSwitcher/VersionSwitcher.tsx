import React from 'react'
import { useParams } from 'react-router-dom'
import { ProjectActions } from 'reducers/projectReducer/projectReducer'

import useProject from 'hooks/useProject'
import useDataset from 'hooks/useDatset'

const VersionSwitcher = () => {
  const { id } = useParams()
  const [, projectDispatch] = useProject()
  const dataset = useDataset(id)

  if (!id || !dataset || !dataset.versions || dataset.versions.length === 0)
    return <></>

  const onSelectVersion = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextVersion = e.target.value

    projectDispatch({
      type: ProjectActions.SetActiveVersion,
      payload: { datasetID: id, version: Number(nextVersion) },
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
