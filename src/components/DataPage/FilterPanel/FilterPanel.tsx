import React, { useState, useRef, Dispatch, SetStateAction } from 'react'
import styled from 'styled-components'
import {
  fields,
  PlusIcon,
  XIcon,
  FieldName,
  Field,
  Filter,
  FilterValues,
  UpdateFilterFunction,
} from './constants'
import InputLabel from '../../ui/InputLabel'
import FilterTypeahead from './FilterTypeahead'

const FilterInput = ({
  fieldLabel,
  fieldType,
  values,
  updateFilter,
  filterIndex,
}: {
  fieldLabel: string
  fieldType: string
  values: FilterValues
  updateFilter: UpdateFilterFunction
  filterIndex: number
}) => {
  return (
    <InputLabel>
      <FieldName>{fieldLabel}</FieldName>
      <FieldInput
        type={fieldType}
        defaultValue={values.join(',')}
        onInput={(e: React.ChangeEvent<HTMLInputElement>) =>
          updateFilter(filterIndex, [e.target.value])
        }
      />
    </InputLabel>
  )
}

const Panel = styled.div<{ isFilterPanelOpen: boolean; height: string }>`
  background-color: rgba(51, 51, 51, 0.9);
  color: #fff;
  height: ${props => props.height};
  position: relative;
  width: 410px;
  top: 73px;
  left: 30px;
  border-radius: 10px;
  margin-right: 30px;
  backdrop-filter: blur(2px);
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.4);
  z-index: 3;
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

const FilterValueSetter = ({
  filterIndex,
  fieldLabel,
  fieldType = 'text',
  values,
  updateFilter,
  options = [],
}: {
  filterIndex: number
  fieldLabel: string
  fieldType: 'text' | 'date'
  values: FilterValues
  updateFilter: UpdateFilterFunction
  options: string[]
}) => {
  const useTypeahead = fieldType === 'text'
  const props = {
    fieldLabel,
    values: values.filter(value => value),
    options,
    updateFilter,
    filterIndex,
  }
  if (useTypeahead) return <FilterTypeahead {...props} />
  else return <FilterInput {...props} fieldType={fieldType} />
}

const FilterPanelButton = styled.button`
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
const FilterPanelToolbarButton = styled(FilterPanelButton)<{
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
const FilterPanelCloseButton = styled(FilterPanelToolbarButton)`
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
const FieldSelectorButton = styled(FilterPanelButton)<{ disabled: boolean }>`
  width: 100%;
  ${({ disabled, theme }) =>
    disabled
      ? 'color: #777; cursor: unset; &:hover { background-color: inherit; }'
      : `
        &:hover { background-color: #36a49d; }
        &:active { outline: 1px solid ${theme.mint}; }
    `}
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
      {Object.entries(fields).map(
        ([fieldId, { label, addedToPanel = false }]) => (
          <FieldSelectorButton
            key={fieldId}
            value={fieldId}
            onClick={_ => {
              addFilterValueSetter(fieldId)
            }}
            disabled={addedToPanel}
          >
            {label}
          </FieldSelectorButton>
        )
      )}
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

const FilterPanelToolbar = styled.nav<{ filterCount: number }>`
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  padding-bottom: 20px;
  padding: 14px 40px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`

const FilterPanel = ({
  isFilterPanelOpen,
  setIsFilterPanelOpen,
  filters,
  setFilters,
  clearFilters,
  updateFilter,
  height,
  optionsForFields,
}: {
  isFilterPanelOpen: boolean
  setIsFilterPanelOpen: Dispatch<SetStateAction<boolean>>
  filters: Filter[]
  setFilters: Dispatch<SetStateAction<Filter[]>>
  clearFilters: () => void
  /** Event handler for when one of the filter input elements receives new input */
  updateFilter: UpdateFilterFunction
  height: string
  optionsForFields: Record<string, string[]>
}) => {
  const [isFieldSelectorOpen, setIsFieldSelectorOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  // height is a 'calc()' expression
  const filterListHeight = height.replace(')', ' - 73px)')
  const filterListRef = useRef<HTMLUListElement>(null)

  const idsOfAddedFields = filters.map(({ fieldId }) => fieldId)
  for (const fieldId in fields) {
    fields[fieldId].addedToPanel = idsOfAddedFields.includes(fieldId)
  }

  return (
    <Panel
      style={{ colorScheme: 'dark' }}
      className="pharos-panel"
      height={height}
      isFilterPanelOpen={isFilterPanelOpen}
      ref={panelRef}
      onClick={_ => {
        setIsFieldSelectorOpen(false)
      }}
    >
      {isFilterPanelOpen && (
        <>
          <FilterPanelToolbar filterCount={filters.length}>
            <FilterPanelToolbarButton
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
            </FilterPanelToolbarButton>
            {filters.length > 0 && (
              <FilterPanelToolbarButton onClick={() => clearFilters()}>
                Clear all
              </FilterPanelToolbarButton>
            )}
            <FilterPanelCloseButton onClick={() => setIsFilterPanelOpen(false)}>
              <XIcon />
            </FilterPanelCloseButton>
          </FilterPanelToolbar>
          {isFieldSelectorOpen && (
            <FieldSelector
              addFilterValueSetter={fieldId => {
                setFilters(filters => [...filters, { fieldId, values: [] }])
                setIsFieldSelectorOpen(false)
                const filterList = filterListRef.current
                setTimeout(() => {
                  if (filterList) filterList.scrollTop = filterList.scrollHeight
                }, 0)
              }}
              fields={fields}
            />
          )}
          <FilterList ref={filterListRef} height={filterListHeight} style={{}}>
            {filters.map((filter, filterIndex) => {
              const { label = '', type = 'text' } = fields[filter.fieldId]
              return (
                <FilterListItem key={`${filter.fieldId}-${filterIndex}`}>
                  <FilterValueSetter
                    filterIndex={filterIndex}
                    fieldLabel={label}
                    fieldType={type}
                    options={optionsForFields[filter.fieldId]}
                    updateFilter={updateFilter}
                    values={filter.values}
                  />
                </FilterListItem>
              )
            })}
          </FilterList>
        </>
      )}
    </Panel>
  )
}

export default FilterPanel
