import React, { useState } from 'react'
import styled from 'styled-components'
import { EditorProps } from 'react-data-grid'

import {
  Datapoint,
  RecordMeta,
  RecordWithMeta,
} from 'reducers/stateReducer/types'

import useDataset from 'hooks/dataset/useDataset'
import useUser from 'hooks/useUser'
import getTimestamp from 'utilities/getTimestamp'
import { StateActions } from 'reducers/stateReducer/stateReducer'
import useDispatch from 'hooks/useDispatch'
import useProjectID from 'hooks/project/useProjectID'

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

const TextEditor = ({ column, onClose, row }: EditorProps<RecordWithMeta>) => {
  const dataset = useDataset()
  const projectID = useProjectID()
  const { researcherID: modifiedBy } = useUser()

  const projectDispatch = useDispatch()

  const datapoint = row[column.key] as Datapoint | undefined

  const [editValue, setEditValue] = useState(datapoint?.dataValue ?? '')

  const dispatchValue = () => {
    const lastUpdated = getTimestamp()

    projectDispatch({
      type: StateActions.SetDatapoint,
      payload: {
        projectID,
        datasetID: dataset.datasetID,
        recordID: (row._meta as RecordMeta).recordID,
        datapointID: column.key,
        lastUpdated,
        datapoint: {
          dataValue: editValue.trim(),
          modifiedBy,
        },
      },
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault()
      dispatchValue()
    }
  }

  // const editable = dataset.releaseStatus !== DatasetReleaseStatus.Published

  // useEffect(() => {
  //   if (!editable) setModal(<CantEditPublished />)
  // }, [editable, setModal])

  // if (!editable) {
  //   return <></>
  // }

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
