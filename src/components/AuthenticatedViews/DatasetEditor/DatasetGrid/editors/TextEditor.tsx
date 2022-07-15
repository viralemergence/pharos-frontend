import React from 'react'
import styled from 'styled-components'
import { EditorProps } from 'react-data-grid'

import { Record, RegisterStatus } from 'reducers/projectReducer/types'
import useProject from 'hooks/project/useProject'
import { ProjectActions } from 'reducers/projectReducer/projectReducer'
import useDatasetID from 'hooks/useDatasetID'

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

const TextEditor = ({ row, column, onClose }: EditorProps<Record, Record>) => {
  const { id: datasetID } = useParams()
  if (!datasetID) throw new Error('Dataset ID not found in url params')
  const [, projectDispatch] = useProject()
  const datasetID = useDatasetID()

  return (
    <TextInput
      ref={autoFocusAndSelect}
      value={row[column.key].displayValue}
      onChange={event => {
        console.log('Dispatch edit event here')
        console.log(event)
        projectDispatch({
          type: ProjectActions.SetRegisterStatus,
          payload: {
            datasetID,
            status: RegisterStatus.Unsaved,
          },
        })
      }}
      onBlur={() => onClose(true)}
    />
  )
}

export default TextEditor
