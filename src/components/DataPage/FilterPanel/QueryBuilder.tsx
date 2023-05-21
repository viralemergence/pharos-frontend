import React, { useState } from 'react'
import styled from 'styled-components'
import InputLabel from '../../ui/InputLabel'
import { Field, FilterValue } from './constants'
import type { Filter } from './constants'

const FieldName = styled.div`
  margin-bottom: 5px;
`
const FieldInput = styled.input`
  ${({ theme }) => theme.smallParagraph};
  padding: 8px 10px;
  font-weight: 600;
  background-color: #202020;
  color: #fff;
  border: 1px solid #fff;
  border-radius: 5px;
  &::-webkit-calendar-picker-indicator {
    filter: invert(1);
    opacity: 0.5;
  }
`

type FilterInputHandler = (
  e: React.ChangeEvent<HTMLInputElement>,
  filterId: string
) => void

const FilterValueSetter = ({
  fieldId,
  fieldLabel,
  fieldType = 'text',
  value,
  onFilterInput,
}: {
  fieldId: string
  fieldLabel: string
  fieldType: 'text' | 'date'
  value: FilterValue
  onFilterInput: FilterInputHandler
}) => {
  return (
    <>
      <InputLabel>
        <FieldName>{fieldLabel}</FieldName>
        <FieldInput
          type={fieldType}
          defaultValue={value}
          onInput={(e: React.ChangeEvent<HTMLInputElement>) =>
            onFilterInput(e, fieldId)
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
  background: transparent;
  &:hover {
    background-color: #202020;
  }
  &:active {
    background-color: #1d1d1d;
  }
`

const FieldSelectorDiv = styled.div`
  position: absolute;
  top: 90px;
  width: calc(100% - 79px);
  left: 39px;
  display: flex;
  flex-flow: column nowrap;
  align-items: flex-start;
  background-color: #202020;
  border-radius: 5px;
  padding: 5px 0;
  z-index: 1;
`
const FieldSelectorButton = styled(QueryBuilderButton)`
  width: 100%;
  &:hover {
    background-color: #36a49d;
  }
`

const FieldSelector = ({
  fields,
  addFilterValueSetter,
}: {
  fields: Record<string, Field>
  addFilterValueSetter: (fieldId: string) => void
}) => {
  return (
    <FieldSelectorDiv
      onClick={e => {
        // If this click event propagates, the panel's click handler will
        // fire, closing the field selector.
        e.stopPropagation()
      }}
    >
      {Object.entries(fields).map(([fieldId, { label }]) => (
        <FieldSelectorButton
          value={fieldId}
          onClick={_ => {
            addFilterValueSetter(fieldId)
          }}
        >
          {label}
        </FieldSelectorButton>
      ))}
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

const QueryBuilderToolbar = styled.nav<{ filterCount: number }>`
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  margin-bottom: 20px;
  padding-bottom: 20px;
  ${({ filterCount }) =>
    filterCount > 0 ? 'border-bottom: 1px solid #fff;' : ''}
`

const QueryBuilder = ({
  fields,
  filters,
  setFilters,
  onFilterInput,
  isFieldSelectorOpen,
  setIsFieldSelectorOpen,
}: {
  fields: Record<string, Field>
  filters: Filter[]
  setFilters: React.Dispatch<React.SetStateAction<Filter[]>>
  onFilterInput: FilterInputHandler
  isFieldSelectorOpen: boolean
  setIsFieldSelectorOpen: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  return (
    <>
      <QueryBuilderToolbar filterCount={filters.length}>
        <QueryBuilderToolbarButton
          onClick={e => {
            setIsFieldSelectorOpen(open => !open)
            // If this click event propagates, the panel's click handler will
            // fire, closing the field selector.
            e.stopPropagation()
          }}
        >
          + Add filter
        </QueryBuilderToolbarButton>
        <QueryBuilderToolbarButton onClick={() => setFilters([])}>
          Clear all
        </QueryBuilderToolbarButton>
      </QueryBuilderToolbar>
      {isFieldSelectorOpen && (
        <FieldSelector
          addFilterValueSetter={fieldId => {
            setFilters(filters => [...filters, { fieldId, value: '' }])
            setIsFieldSelectorOpen(false)
          }}
          fields={fields}
        />
      )}
      <FieldList>
        {filters.map((filter, i) => {
          const { label = '', type = 'text' } = fields[filter.fieldId]
          return (
            <FieldListItem>
              <FilterValueSetter
                fieldId={filter.fieldId}
                fieldLabel={label}
                fieldType={type}
                key={i}
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
