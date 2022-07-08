import React from 'react'
import { useParams } from 'react-router-dom'
import { ProjectActions } from 'reducers/projectReducer/projectReducer'

import useProject from 'hooks/useProject'
import useDataset from 'hooks/useDatset'

const VersionSwitcher = () => {
	const { id } = useParams()
	const [, projectDispatch] = useProject()
	const dataset = useDataset(id)

	if (!id || !dataset || !dataset.versions) return <></>

	const onSelectVersion = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const nextVersion = e.target.value

		projectDispatch({
			type: ProjectActions.SetActiveVersion,
			payload: { datasetID: id, version: Number(nextVersion) },
		})
	}

	return (
		<select
			onChange={onSelectVersion}
			value={dataset.activeVersion}
			style={{ marginLeft: 'auto', marginRight: '15px', fontSize: 18 }}
		>
			{dataset.versions.map((version, index) => (
				<option value={index}>{version.date}</option>
			))}
		</select>
	)
}

export default VersionSwitcher
