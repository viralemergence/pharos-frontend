import React, { useRef, useState } from 'react'
import styled from 'styled-components'
import InputLabel from '../../ui/InputLabel'

type Field = {
  id: string
  type: string
  name: string
}

type FieldBuilderProps = {
  allFields: Field[]
  onFilterInput: FilterInputHandler
}
const FieldBuilder = ({ allFields, onFilterInput }: FieldBuilderProps) => {
  const [field, setField] = useState<Field | null>(null)
  if (field) {
    return <FieldSetter field={field} onFilterInput={onFilterInput} />
  } else {
    return <FieldSelector fields={allFields} setField={setField} />
  }
}

const FieldName = styled.div``
const FieldInput = styled.input``

type FilterInputHandler = (
  e: React.ChangeEvent<HTMLInputElement>,
  filterId: string
) => void

const FieldSetter = ({
  field,
  value,
  onFilterInput,
}: {
  field: Field
  value: string
  onFilterInput: FilterInputHandler
}) => {
  return (
    <>
      <InputLabel>
        <FieldName>{field.name}</FieldName>
        <FieldInput
          type="text"
          defaultValue={value}
          onInput={e => onFilterInput(e, field.id)}
        />
      </InputLabel>
    </>
  )
}

const FieldSelector = ({
  fields,
  setField,
}: {
  fields: Field[]
  setField: (field: Field) => void
}) => {
  return (
    <>
      {fields.map(field => {
        return (
          <button value={field.id} onClick={e => setField(field)}>
            {field.name}
          </button>
        )
      })}
    </>
  )
}

const AddFieldButton = () => {
  return <button>Add Field</button>
}

const QueryBuilder = ({ fields }) => {
  const fieldCountRef = useRef(0)
  return (
    <>
      <AddFieldButton />
      <ul>
        {[...Array(fieldCountRef.current)].map(i => {
          return (
            <li>
              <FieldBuilder key={i} allFields={fields} />
            </li>
          )
        })}
      </ul>
    </>
  )
}
