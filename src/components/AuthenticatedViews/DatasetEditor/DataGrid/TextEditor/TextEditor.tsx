import React from 'react'
import { EditorProps } from 'react-data-grid'
import { Record } from 'reducers/projectReducer/types'
import styled from 'styled-components'

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

function autoFocusAndSelect(input: HTMLInputElement | null) {
  input?.focus()
  input?.select()
}

export default function TextEditor<TRow, TSummaryRow>({
  row,
  column,
  onRowChange,
  onClose,
}: EditorProps<TRow, TSummaryRow>) {
  return (
    <TextInput
      ref={autoFocusAndSelect}
      value={
        (row[column.key as keyof TRow] as unknown as { value: string }).value
      }
      onChange={event =>
        onRowChange({
          ...row,
          [column.key]: {
            ...(row as unknown as Record)[column.key as keyof Record],
            value: event.target.value,
            modified: true,
          },
        })
      }
      onBlur={() => onClose(true)}
    />
  )
}
