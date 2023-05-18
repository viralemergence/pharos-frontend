import React, { useRef, useState } from 'react'
import styled from 'styled-components'
import InputLabel from '../../ui/InputLabel'

export type Field = {
  id: string
  label: string
  dataGridKey?: string
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
        <FieldName>{field.label}</FieldName>
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

const FieldSelectorDiv = styled.div`
  display: flex;
  flex-flow: column nowrap;
  align-items: flex-start;
  background-color: #202020;
  border-radius: 5px;
  padding: 5px 0;
`
const FieldSelectorButton = styled.button`
  ${props => props.theme.smallParagraph};
  text-align: left;
  padding: 10px 15px;
  background-color: transparent;
  flex: 1;
  width: 100%;
  color: #fff;
  border: 0;
  cursor: pointer;
  &:hover {
    background-color: #333;
  }
`

const FieldSelector = ({
  fields,
  setField,
}: {
  fields: Field[]
  setField: (field: Field) => void
}) => {
  return (
    <FieldSelectorDiv>
      {fields.map(field => {
        return (
          <FieldSelectorButton value={field.id} onClick={e => setField(field)}>
            {field.label}
          </FieldSelectorButton>
        )
      })}
    </FieldSelectorDiv>
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

const FieldListItem = styled.li`
  list-style: none;
  margin-top: 20px;
`
const FieldList = styled.ul`
  margin: 0;
  padding: 0;
`

const QueryBuilder = ({ fields }: { fields: Field[] }) => {
  const [fieldCount, setFieldCount] = useState(0)
  const [query, setQuery] = useState<Query>([])
  return (
    <>
      <AddFieldButton onClick={() => setFieldCount(count => count + 1)} />
      <FieldList>
        {[...Array(fieldCount)].map(i => {
          return (
            <FieldListItem>
              <FieldBuilder key={i} allFields={fields} />
            </FieldListItem>
          )
        })}
      </FieldList>
    </>
  )
}

export default QueryBuilder
