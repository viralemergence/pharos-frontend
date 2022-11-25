import React from 'react'
import styled from 'styled-components'

import useDataset from 'hooks/dataset/useDataset'

const Select = styled.select`
  ${({ theme }) => theme.smallParagraph};
  color: ${({ theme }) => theme.darkGray};
  padding: 10px 20px;
  border-radius: 0;
  border: 1px solid ${({ theme }) => theme.medDarkGray};
  background: white;
`

const VersionSwitcher = () => {
  const dataset = useDataset()
  // const datasetID = useDatasetID()
  // const projectDispatch = useDispatch()

  if (!dataset || !dataset.versions || dataset.versions.length < 2) return <></>

  const onSelectVersion = (e: React.ChangeEvent<HTMLSelectElement>) => {
    // const nextVersion = e.target.value
    console.log('reimplement version switching', e)
    // projectDispatch({
    //   type: StateActions.SetActiveVersion,
    //   payload: { datasetID: datasetID, version: Number(nextVersion) },
    // })
  }

  return (
    <label>
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
