import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import InputLabel from '../../ui/InputLabel'
import { VALUE_SEPARATOR, PlusIcon, XIcon } from './constants'
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
  border-radius: 5px;
  background-color: #58b7b1;
  color: #101010;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  gap: 5px;
  padding-left: 10px;
`
const SelectedTypeaheadValueDeleteButton = styled.button`
  border: 0;
  background: transparent;
  cursor: pointer;
  padding: 0 10px 0 7px;
  margin-left: 3px;
  height: 30px;
  border-bottom-right-radius: 5px;
  border-top-right-radius: 5px;
  &:hover {
    background: rgba(0, 0, 0, 0.1);
  }
  &:active {
    outline: 1px solid ${({ theme }) => theme.mint};
  }
`

const FilterValueSetter = ({
  filterIndex,
  fieldLabel,
  fieldType = 'text',
  value,
  applyFilter,
  options = [],
}: {
  filterIndex: number
  fieldLabel: string
  fieldType: 'text' | 'date'
  value: FilterValue
  applyFilter: ApplyFilterFunction
  options: string[]
}) => {
  // TODO: Have this be set based on value rather than be a separate piece of set.
  const [selectedTypeaheadItems, setSelectedTypeaheadItems] = useState<Item[]>(
    []
  )
  const selectedTypeaheadItemLabels = selectedTypeaheadItems.map(
    ({ label }) => label
  )

  // Remove selected items from available options
  options = options.filter(
    option => !selectedTypeaheadItemLabels.includes(option)
  )

  // TODO: The problem here is that the state of 'value' which controls the
  // component. Lift setSelectedTypeaheadItems into a higher component. Or
  // perhaps try to avoid having so much state.

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

  // TODO: Use Typeahead component's svg prop
  /** Workaround for fixing colors */
  const fixTypeaheadColors = () => {
    const typeaheadIcon = Array.from(
      document.querySelectorAll<HTMLElement>('form input[type=search] + div')
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

  // TODO: remove VALUE_SEPARATOR
  const handleTypeaheadChange = (items: Item[]) => {
    setSelectedTypeaheadItems(items)
    applyFilter(
      filterIndex,
      items.map(({ label }) => label).join(VALUE_SEPARATOR)
    )
  }
  const useTypeahead = fieldType === 'text'
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
              applyFilter(filterIndex, e.target.value)
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
                <XIcon extraStyle="stroke: #101010" />
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
const QueryBuilderToolbarButton = styled(QueryBuilderButton)<{
  isFieldSelectorOpen?: boolean
}>`
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  ${({ isFieldSelectorOpen }) =>
    !isFieldSelectorOpen
      ? 'border-bottom-left-radius: 5px; border-bottom-right-radius: 5px;'
      : ''}
  &:hover {
    background-color: #202020;
  }
  background-color: ${({ isFieldSelectorOpen }) =>
    isFieldSelectorOpen ? '#202020' : 'transparent'};
  &:active {
    outline: 2px solid rgba(60, 60, 60, 1);
  }
`
const FilterPanelCloseButton = styled(QueryBuilderToolbarButton)`
  position: absolute;
  right: 0;
  top: 0;
  padding: 5px 10px;
  border-radius: 10px;
  background: transparent;
`

const FieldSelectorDiv = styled.div`
  position: absolute;
  top: 60px;
  width: calc(100% - 79px);
  left: 40px;
  display: flex;
  flex-flow: column nowrap;
  align-items: flex-start;
  background-color: #202020;
  border-radius: 5px;
  border-top-left-radius: 0;
  padding: 5px 0;
  z-index: 1;
`
const FieldSelectorButton = styled(QueryBuilderButton)`
  width: 100%;
  &:hover {
    background-color: #36a49d;
  }
  &:active {
    outline: 1px solid ${({ theme }) => theme.mint};
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
  setIsFilterPanelOpen,
  optionsForFields,
  panelHeight,
}: {
  fields: Record<string, Field>
  filters: Filter[]
  setFilters: React.Dispatch<React.SetStateAction<Filter[]>>
  applyFilter: ApplyFilterFunction
  isFieldSelectorOpen: boolean
  setIsFieldSelectorOpen: React.Dispatch<React.SetStateAction<boolean>>
  setIsFilterPanelOpen: React.Dispatch<React.SetStateAction<boolean>>
  optionsForFields: Record<string, string[]>
  panelHeight: string
}) => {
  // panelHeight is a 'calc()' expression
  const filterListHeight = panelHeight.replace(')', ' - 73px)')
  const filterListRef = useRef<HTMLUListElement>(null)
  return (
    <>
      <QueryBuilderToolbar filterCount={filters.length}>
        <QueryBuilderToolbarButton
          className="add-filter"
          isFieldSelectorOpen={isFieldSelectorOpen}
          onClick={e => {
            setIsFieldSelectorOpen(open => !open)
            // If this click event propagates, the panel's click handler will
            // fire, closing the field selector.
            e.stopPropagation()
          }}
        >
          <PlusIcon style={{ marginRight: '5px' }} /> Add filter
        </QueryBuilderToolbarButton>
        {filters.length > 0 && (
          <QueryBuilderToolbarButton onClick={() => setFilters([])}>
            Clear all
          </QueryBuilderToolbarButton>
        )}
        <FilterPanelCloseButton onClick={() => setIsFilterPanelOpen(false)}>
          <XIcon />
        </FilterPanelCloseButton>
      </QueryBuilderToolbar>
      {isFieldSelectorOpen && (
        <FieldSelector
          addFilterValueSetter={fieldId => {
            setFilters(filters => [...filters, { fieldId, value: '' }])
            setIsFieldSelectorOpen(false)
            const filterList = filterListRef.current
            setTimeout(() => {
              if (filterList) {
                filterList.scrollTop = filterList.scrollHeight
              }
            }, 0)
          }}
          fields={fields}
        />
      )}
      <FilterList ref={filterListRef} height={filterListHeight} style={{}}>
        {filters.map((filter, filterIndex) => {
          const { label = '', type = 'text' } = fields[filter.fieldId]
          return (
            <FilterListItem key={`${filter.fieldId}${filterIndex}`}>
              <FilterValueSetter
                filterIndex={filterIndex}
                fieldLabel={label}
                fieldType={type}
                options={optionsForFields[filter.fieldId]}
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
