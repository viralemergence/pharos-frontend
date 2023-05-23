import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import InputLabel from '../../ui/InputLabel'
import { VALUE_SEPARATOR } from './constants'
import type {
  Field,
  FilterValue,
  Filter,
  ApplyFilterFunction,
} from './constants'
import Typeahead, { Item } from '@talus-analytics/library.ui.typeahead'

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
const SelectedTypeaheadValues = styled.ul`
  margin-top: 10px;
  list-style: none;
  padding: 0;
  display: flex;
  flex-flow: column nowrap;
  align-items: flex-start;
  gap: 5px;
`
const SelectedTypeaheadValue = styled.li`
  ${props => props.theme.smallParagraph};
  padding: 5px 10px;
  border-radius: 5px;
  background-color: #58b7b1;
  color: #000;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  gap: 5px;
`
const SelectedTypeaheadValueDeleteButton = styled.button`
  border: 0;
  background: transparent;
  cursor: pointer;
`

const FilterValueSetter = ({
  fieldId,
  fieldLabel,
  fieldType = 'text',
  value,
  applyFilter,
  options,
}: {
  fieldId: string
  fieldLabel: string
  fieldType: 'text' | 'date'
  value: FilterValue
  applyFilter: ApplyFilterFunction
  options: string[]
}) => {
  const [selectedTypeaheadItems, setSelectedTypeaheadItems] = useState<Item[]>(
    []
  )

  // On first render, load the previously set filter values into the Typeahead
  useEffect(() => {
    let values =
      typeof value === 'string' ? value.split(VALUE_SEPARATOR) : value
    values = values.filter(value => value)
    if (values.length > 0) {
      setSelectedTypeaheadItems(
        values.map(value => ({ key: value, label: value }))
      )
    }
  }, [value])

  /** Workaround for fixing colors */
  const fixTypeaheadColors = () => {
    const typeaheadIcon = document.querySelectorAll(
      'form input[type=search] + div'
    )?.[0]
    if (typeaheadIcon) typeaheadIcon.style.filter = 'invert(1)'
  }

  useEffect(() => {
    fixTypeaheadColors()
  }, [])

  const removeItem = (itemToRemove: Item) => {
    const amendedItems = selectedTypeaheadItems.filter(
      ({ key }) => key !== itemToRemove.key
    )
    handleTypeaheadChange(amendedItems)
  }

  const handleTypeaheadChange = (items: Item[]) => {
    setSelectedTypeaheadItems(items)
    applyFilter(
      items.map(({ label }) => label).join(VALUE_SEPARATOR),
      fieldId,
      0
    )
  }
  const useTypeahead = options?.length > 0
  return (
    <>
      <InputLabel>
        <FieldName>{fieldLabel}</FieldName>
        {useTypeahead ? (
          <>
            <Typeahead
              multiselect={true}
              items={options.map(option => ({ key: option, label: option }))}
              values={selectedTypeaheadItems}
              onAdd={(newItem: Item) => {
                const itemAlreadyAdded = selectedTypeaheadItems
                  .map(({ key }) => key)
                  .includes(newItem.key)
                if (!itemAlreadyAdded)
                  handleTypeaheadChange([...selectedTypeaheadItems, newItem])
              }}
              onRemove={removeItem}
              placeholder={`${selectedTypeaheadItems.length} selected`}
              backgroundColor="#000"
              fontColor="white"
              borderColor="white"
            />
          </>
        ) : (
          <FieldInput
            type={fieldType}
            defaultValue={value}
            onInput={(e: React.ChangeEvent<HTMLInputElement>) =>
              applyFilter(e.target.value, fieldId)
            }
          />
        )}
      </InputLabel>
      {useTypeahead && selectedTypeaheadItems.length > 0 && (
        <SelectedTypeaheadValues>
          {selectedTypeaheadItems.map(item => (
            <SelectedTypeaheadValue key={item.key}>
              {item.label}{' '}
              <SelectedTypeaheadValueDeleteButton
                onClick={() => {
                  removeItem(item)
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </SelectedTypeaheadValueDeleteButton>
            </SelectedTypeaheadValue>
          ))}
        </SelectedTypeaheadValues>
      )}
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
          key={fieldId}
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

const FilterListItem = styled.li`
  list-style: none;
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
`
const FilterList = styled.ul<{ height: string }>`
  margin: 0;
  padding: 34px 40px;
  overflow-y: auto;
  height: ${props => props.height};
`

const QueryBuilderToolbar = styled.nav<{ filterCount: number }>`
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  padding-bottom: 20px;
  padding: 14px 40px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`

const QueryBuilder = ({
  fields,
  filters,
  setFilters,
  applyFilter,
  isFieldSelectorOpen,
  setIsFieldSelectorOpen,
  optionsForFields,
  panelHeight,
}: {
  fields: Record<string, Field>
  filters: Filter[]
  setFilters: React.Dispatch<React.SetStateAction<Filter[]>>
  applyFilter: ApplyFilterFunction
  isFieldSelectorOpen: boolean
  setIsFieldSelectorOpen: React.Dispatch<React.SetStateAction<boolean>>
  optionsForFields: Record<string, string[]>
  panelHeight: string
}) => {
  // panelHeight is a 'calc()' expression
  const filterListHeight = panelHeight.replace(')', ' - 73px)')
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
      <FilterList height={filterListHeight}>
        {filters.map((filter, i) => {
          const { label = '', type = 'text' } = fields[filter.fieldId]
          return (
            <FilterListItem key={`${filter.fieldId}${i}`}>
              <FilterValueSetter
                fieldId={filter.fieldId}
                fieldLabel={label}
                fieldType={type}
                options={optionsForFields[filter.fieldId]}
                key={i}
                applyFilter={applyFilter}
                value={filter.value}
              />
            </FilterListItem>
          )
        })}
      </FilterList>
    </>
  )
}

export default QueryBuilder
