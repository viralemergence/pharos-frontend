import React, { useState } from 'react'
import styled from 'styled-components'
import { EditorProps } from 'react-data-grid'

import {
  Datapoint,
  RecordMeta,
  RecordWithID,
} from 'reducers/stateReducer/types'

import useDataset from 'hooks/dataset/useDataset'
import useModal from 'hooks/useModal/useModal'
import { useEffect } from 'react'
import { IDMustBeUnique, OnlyEditMostRecent } from './textEditorMessages'
import useRegister from 'hooks/register/useRegister'
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

const recordIDColumn = 'SampleID'

const TextEditor = ({ column, onClose, row }: EditorProps<RecordWithID>) => {
  const user = useUser()
  const dataset = useDataset()
  const register = useRegister()
  const projectID = useProjectID()

  const setModal = useModal()
  const projectDispatch = useDispatch()

  const datapoint = row[column.key] as Datapoint | undefined

  const [editValue, setEditValue] = useState(datapoint?.displayValue ?? '')

  const dispatchValue = () => {
    // special case for handling the ID column
    if (column.key === recordIDColumn) {
      // get all current SampleID values
      const idMap = Object.entries(register).reduce(
        (acc, [recordID, row]) => ({
          ...acc,
          [row[recordIDColumn]?.displayValue]: recordID,
        }),
        {} as { [key: string]: string }
      )

      if (
        idMap[editValue] &&
        idMap[editValue] !== (row._meta as RecordMeta).recordID
      ) {
        setModal(<IDMustBeUnique {...{ recordIDColumn }} />)
        return
      }
    }

    if (!user.data?.researcherID)
      throw new Error('Cannot set datapoint when user data is undefined ')

    const modifiedBy = user.data.researcherID

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
          displayValue: editValue,
          dataValue: editValue,
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

  const editable =
    Number(dataset.activeVersion) === dataset.versions.length - 1 ||
    dataset.versions.length === 0

  console.log(dataset)

  useEffect(() => {
    if (!editable)
      setModal(
        <OnlyEditMostRecent latestVersion={dataset.versions.length - 1} />
      )
  }, [editable, setModal, dataset.versions.length])

  if (!editable) {
    return <></>
  }

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
