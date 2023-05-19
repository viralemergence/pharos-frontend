import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import InputLabel from '../../ui/InputLabel'
import { Field, FilterData } from './constants'

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

const QueryBuilderButton = styled.button`
  ${props => props.theme.smallParagraph};
  text-align: left;
  padding: 10px 15px;
  background-color: transparent;
  color: #fff;
  border: 0;
  cursor: pointer;
  &:hover {
    background-color: #333;
  }
`
const QueryBuilderToolbarButton = styled(QueryBuilderButton)`
  border-radius: 5px;
  background-color: #202020;
`

const FieldSelectorDiv = styled.div`
  display: flex;
  flex-flow: column nowrap;
  align-items: flex-start;
  background-color: #202020;
  border-radius: 5px;
  padding: 5px 0;
`
const FieldSelectorButton = styled(QueryBuilderButton)`
  width: 100%;
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
          <FieldSelectorButton value={field.id} onClick={_e => setField(field)}>
            {field.label}
          </FieldSelectorButton>
        )
      })}
    </FieldSelectorDiv>
  )
}

const FieldListItem = styled.li`
  list-style: none;
  margin-top: 20px;
`
const FieldList = styled.ul`
  margin: 0;
  padding: 0;
`

const PanelHeader = styled.div`
  ${({ theme }) => theme.smallParagraph};
  padding: 10px;
  flex: 1;
`
const QueryBuilderToolbar = styled.nav`
  display: flex;
  flex-flow: row wrap;
  margin-bottom: 20px;
  gap: 10px;
`

const QueryBuilder = ({
  fields,
  filterData,
  onFilterInput,
}: {
  fields: Field[]
  filterData: FilterData
  onFilterInput: FilterInputHandler
}) => {
  const [fieldCount, setFieldCount] = useState(0)

  useEffect(() => {
    setFieldCount(fieldCount =>
      Math.max(fieldCount, Object.entries(filterData).length)
    )
  }, [])
  // TODO: Change dependency array?

  return (
    <>
      <QueryBuilderToolbar>
        <PanelHeader>Filters</PanelHeader>
        <QueryBuilderToolbarButton
          onClick={() => setFieldCount(count => count + 1)}
        >
          + Add filter
        </QueryBuilderToolbarButton>
        <QueryBuilderToolbarButton onClick={() => setFieldCount(0)}>
          Clear all
        </QueryBuilderToolbarButton>
      </QueryBuilderToolbar>
      <FieldList>
        {[...Array(fieldCount)].map(i => {
          return (
            <FieldListItem>
              <FieldBuilder
                key={i}
                allFields={fields}
                onFilterInput={onFilterInput}
                value={''}
              />
            </FieldListItem>
          )
        })}
      </FieldList>
    </>
  )
}

export default QueryBuilder
