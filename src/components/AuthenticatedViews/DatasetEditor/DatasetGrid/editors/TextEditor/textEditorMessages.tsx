import React from 'react'
import MintButton from 'components/ui/MintButton'
import { ProjectActions } from 'reducers/projectReducer/projectReducer'

import useDatasetID from 'hooks/dataset/useDatasetID'
import useProjectDispatch from 'hooks/project/useProjectDispatch'
import useModalMessage from '../../ModalMessage/useModalMessage'

interface IDMustBeUniqueProps {
  recordIDColumn: string
}

export const IDMustBeUnique = ({ recordIDColumn }: IDMustBeUniqueProps) => {
  const setModalContent = useModalMessage()

  return (
    <div style={{ maxWidth: 500 }}>
      <h3>{recordIDColumn} must be unique within the dataset</h3>
      <p>
        Unique {recordIDColumn} values are used for merging new data from
        imported CSVs, so non-unique SampleIDs would make future updates
        ambiguous.
      </p>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <MintButton onClick={() => setModalContent(null)}>ok</MintButton>
      </div>
    </div>
  )
}

interface OnlyEditMostRecentProps {
  latestVersion: number
}

export const OnlyEditMostRecent = ({
  latestVersion,
}: OnlyEditMostRecentProps) => {
  const datasetID = useDatasetID()
  const setModalContent = useModalMessage()
  const projectDispatch = useProjectDispatch()

  return (
    <>
      <h3 style={{}}>Only the most recent version can be edited</h3>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <MintButton onClick={() => setModalContent(null)}>ok</MintButton>
        <MintButton
          style={{ marginLeft: 15 }}
          secondary
          onClick={() => {
            projectDispatch({
              type: ProjectActions.SetActiveVersion,
              payload: { datasetID, version: latestVersion },
            })
            setModalContent(null)
          }}
        >
          Go to most recent
        </MintButton>
      </div>
    </>
  )
}
