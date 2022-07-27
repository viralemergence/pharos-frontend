import React, { useState } from 'react'
import styled from 'styled-components'
import { EditorProps } from 'react-data-grid'

import {
  Datapoint,
  RecordMeta,
  RecordWithID,
  RegisterStatus,
} from 'reducers/projectReducer/types'
import { ProjectActions } from 'reducers/projectReducer/projectReducer'
import useProjectDispatch from 'hooks/project/useProjectDispatch'
import useDatasetID from 'hooks/dataset/useDatasetID'
import useUser from 'hooks/useUser'
import useDataset from 'hooks/dataset/useDataset'
import Modal from 'components/ui/Modal'
import MintButton from 'components/ui/MintButton'

const TextInput = styled.input`
  appearance: none;
  box-sizing: border-box;
  inline-size: 100%;
  block-size: 100%;
  padding-block: 0;
  padding-inline: 6px;
  border: 2px solid #ccc;
  vertical-align: top;
  color: var(--rdg-color);
  background-color: var(--rdg-background-color);
  font-family: inherit;
  font-size: var(--rdg-font-size);
  &:focus {
    border-color: var(--rdg-selection-color);
    outline: none;
  }
  &::placeholder {
    color: #999;
    opacity: 1;
  }
`

const autoFocusAndSelect = (input: HTMLInputElement | null) => {
  input?.focus()
  input?.select()
}

const TextEditor = ({ column, onClose, row }: EditorProps<RecordWithID>) => {
  const user = useUser()
  const datasetID = useDatasetID()
  const projectDispatch = useProjectDispatch()
  const dataset = useDataset()

  const datapoint = row[column.key]

  const [editValue, setEditValue] = useState(
    (datapoint as Datapoint).displayValue
  )

  const dispatchValue = () => {
    console.log('dispatching setDatapoint')
    projectDispatch({
      type: ProjectActions.SetDatapoint,
      payload: {
        datasetID,
        recordID: (row._meta as RecordMeta).recordID,
        datapointID: column.key,
        datapoint: {
          displayValue: editValue,
          dataValue: editValue,
          modifiedBy: user.data?.researcherID,
        },
      },
    })
    projectDispatch({
      type: ProjectActions.SetRegisterStatus,
      payload: {
        datasetID,
        status: RegisterStatus.Unsaved,
      },
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      console.log('enter key')
      dispatchValue()
    }
  }

  console.log('EDITOR Renders')

  const [editable] = useState(
    dataset.activeVersion === dataset.versions.length - 1
  )
  const [open, setOpen] = useState(true)
  if (!editable)
    return (
      <Modal {...{ open, setOpen }}>
        <h3 style={{}}>Only the most recent version can be edited</h3>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <MintButton onClick={() => setOpen(false)}>ok</MintButton>
          <MintButton
            style={{ marginLeft: 15 }}
            secondary
            onClick={() =>
              projectDispatch({
                type: ProjectActions.SetActiveVersion,
                payload: { datasetID, version: dataset.versions.length - 1 },
              })
            }
          >
            Go to most recent
          </MintButton>
        </div>
      </Modal>
    )

  return (
    <TextInput
      key={(row._meta as RecordMeta).recordID}
      ref={autoFocusAndSelect}
      value={editValue}
      onChange={event => {
        setEditValue(event.target.value)
      }}
      onKeyDown={e => handleKeyDown(e)}
      onBlur={() => {
        dispatchValue()
        onClose(true)
      }}
    />
  )
}

export default TextEditor
