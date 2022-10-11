import React from 'react'
import MintButton from 'components/ui/MintButton'
import { StateActions } from 'reducers/projectReducer/stateReducer'

import useDatasetID from 'hooks/dataset/useDatasetID'
import useDispatch from 'hooks/useDispatch'
import useModal from 'hooks/useModal/useModal'

interface IDMustBeUniqueProps {
  recordIDColumn: string
}

export const IDMustBeUnique = ({ recordIDColumn }: IDMustBeUniqueProps) => {
  const setModal = useModal()

  return (
    <div style={{ maxWidth: 500 }}>
      <h3>{recordIDColumn} must be unique within the dataset</h3>
      <p>
        Unique {recordIDColumn} values are used for merging new data from
        imported CSVs, so non-unique SampleIDs would make future updates
        ambiguous.
      </p>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <MintButton onClick={() => setModal(null)}>ok</MintButton>
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
  const setModal = useModal()
  const projectDispatch = useDispatch()

  return (
    <>
      <h3 style={{}}>Only the most recent version can be edited</h3>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <MintButton onClick={() => setModal(null)}>ok</MintButton>
        <MintButton
          style={{ marginLeft: 15 }}
          secondary
          onClick={() => {
            projectDispatch({
              type: StateActions.SetActiveVersion,
              payload: { datasetID, version: latestVersion },
            })
            setModal(null)
          }}
        >
          Go to most recent
        </MintButton>
      </div>
    </>
  )
}
