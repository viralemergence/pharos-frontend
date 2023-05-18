import React, { useRef, useState } from 'react'
import styled from 'styled-components'
import InputLabel from '../../ui/InputLabel'

export type Field = {
  id: string
  type: string
  name: string
  dataGridKey: string
}

type FieldBuilderProps = {
  allFields: Field[]
  onFilterInput: FilterInputHandler
  // TODO: Perhaps just string[]?
  value: string | string[]
}
const FieldBuilder = ({
  allFields,
  value,
  onFilterInput,
}: FieldBuilderProps) => {
  const [field, setField] = useState<Field | null>(null)
  if (field) {
    return (
      <FieldValueSetter
        field={field}
        value={value}
        onFilterInput={onFilterInput}
      />
    )
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

const FieldValueSetter = ({
  field,
  value,
  onFilterInput,
}: {
  field: Field
  value: string | string[]
  onFilterInput: FilterInputHandler
}) => {
  return (
    <>
      <InputLabel>
        <FieldName>{field.name}</FieldName>
        <FieldInput
          type="text"
          defaultValue={value}
          onInput={(e: React.ChangeEvent<HTMLInputElement>) =>
            onFilterInput(e, field.id)
          }
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

const AddFieldButton = ({ onClick }) => {
  return <button onClick={onClick}>Add Field</button>
}

type QueryField = {
  fieldId: string
  fieldValue: string | string[] | null
}

type Query = QueryField[]

const QueryBuilder = ({ fields }: { fields: Field[] }) => {
  const [fieldCount, setFieldCount] = useState(0)
  const [query, setQuery] = useState<Query>([])
  return (
    <>
      <AddFieldButton onClick={() => setFieldCount(count => count + 1)} />
      <ul>
        {[...Array(fieldCount)].map(i => {
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

export default QueryBuilder
