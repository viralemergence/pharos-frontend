import React from 'react'
import styled from 'styled-components'
import { ProjectActions } from 'reducers/projectReducer/projectReducer'

import useDataset from 'hooks/dataset/useDataset'
import useDatasetID from 'hooks/dataset/useDatasetID'
import useProjectDispatch from 'hooks/project/useProjectDispatch'

const Select = styled.select`
  ${({ theme }) => theme.smallParagraph};
  color: ${({ theme }) => theme.black};
  padding: 10px 20px;
  border-radius: 0;
  border: 1px solid ${({ theme }) => theme.medDarkGray};
  background: white;
`

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
    <label style={{ marginLeft: 'auto', marginRight: 15 }}>
      <Select onChange={onSelectVersion} value={dataset.activeVersion}>
        {dataset.versions.map((version, index) => (
          <option key={index + version.date} value={index}>
            Version released {new Date(version.date).toLocaleString()}
          </option>
        ))}
      </Select>
    </label>
  )
}

export default VersionSwitcher
