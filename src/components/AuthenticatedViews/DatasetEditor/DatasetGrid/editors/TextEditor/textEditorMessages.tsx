import MintButton from 'components/ui/MintButton'
import React, { Dispatch, SetStateAction, ReactNode } from 'react'
import {
  ProjectAction,
  ProjectActions,
} from 'reducers/projectReducer/projectReducer'

interface IDMustBeUniqueProps {
  recordIDColumn: string
  setModalContent: Dispatch<SetStateAction<ReactNode>>
}

export const IDMustBeUnique = ({
  recordIDColumn,
  setModalContent,
}: IDMustBeUniqueProps) => (
  <div style={{ maxWidth: 500 }}>
    <h3>{recordIDColumn} must be unique within the dataset</h3>
    <p>
      Unique {recordIDColumn} values are used for merging new data from imported
      CSVs, so non-unique SampleIDs would make future updates ambiguous.
    </p>
    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
      <MintButton onClick={() => setModalContent(null)}>ok</MintButton>
    </div>
  </div>
)

interface OnlyEditMostRecentProps {
  datasetID: string
  latestVersion: number
  projectDispatch: Dispatch<ProjectAction>
  setModalContent: Dispatch<SetStateAction<ReactNode>>
}

export const OnlyEditMostRecent = ({
  datasetID,
  latestVersion,
  projectDispatch,
  setModalContent,
}: OnlyEditMostRecentProps) => (
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
