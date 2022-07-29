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
import useModalMessage from '../../ModalMessage/useModalMessage'
import { useEffect } from 'react'
import { IDMustBeUnique, OnlyEditMostRecent } from './textEditorMessages'

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
  const datasetID = useDatasetID()
  const projectDispatch = useProjectDispatch()
  const dataset = useDataset()

  const setModalContent = useModalMessage()

  const datapoint = row[column.key] as Datapoint | undefined

  const [editValue, setEditValue] = useState(datapoint?.displayValue ?? '')

  const dispatchValue = () => {
    if (!dataset.register) return

    // special case for handling the ID column
    if (column.key === recordIDColumn) {
      // get all current SampleID values
      const idMap = Object.entries(dataset.register).reduce(
        (acc, [recordID, row]) => ({
          ...acc,
          [row[recordIDColumn].displayValue]: recordID,
        }),
        {} as { [key: string]: string }
      )

      if (
        idMap[editValue] &&
        idMap[editValue] !== (row._meta as RecordMeta).recordID
      ) {
        setModalContent(
          <IDMustBeUnique {...{ recordIDColumn, setModalContent }} />
        )
        return
      }
    }

    if (!user.data?.researcherID) return

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
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      dispatchValue()
    }
  }

  const editable =
    dataset.activeVersion === dataset.versions.length - 1 ||
    dataset.versions.length === 0

  useEffect(() => {
    if (!editable)
      setModalContent(
        <OnlyEditMostRecent
          {...{
            datasetID,
            latestVersion: dataset.versions.length - 1,
            projectDispatch,
            setModalContent,
          }}
        />
      )
  }, [
    editable,
    datasetID,
    projectDispatch,
    setModalContent,
    dataset.versions.length,
  ])

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
