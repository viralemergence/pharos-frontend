import React, { ChangeEvent } from 'react'
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

  const datapoint = row[column.key]

  console.log(row)

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    projectDispatch({
      type: ProjectActions.SetDatapoint,
      payload: {
        datasetID,
        recordID: (row._meta as RecordMeta).recordID,
        datapointID: column.key,
        datapoint: {
          displayValue: event.target.value,
          dataValue: event.target.value,
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

  return (
    <TextInput
      ref={autoFocusAndSelect}
      value={(datapoint as Datapoint).displayValue}
      onChange={event => handleChange(event)}
      onBlur={() => onClose(true)}
    />
  )
}

export default TextEditor
