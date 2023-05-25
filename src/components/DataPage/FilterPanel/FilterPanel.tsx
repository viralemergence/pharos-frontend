import React, {
  useEffect,
  useState,
  useRef,
  Dispatch,
  SetStateAction,
} from 'react'
import styled from 'styled-components'
import {
  fields,
  Field,
  Filter,
  FilterValues,
  ApplyFilterFunction,
} from './constants'
import InputLabel from '../../ui/InputLabel'
import { PlusIcon, XIcon } from './constants'
import { Item as TypeaheadItem } from '@talus-analytics/library.ui.typeahead'
import FilterTypeahead from './FilterTypeahead'

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

const FilterValueSetter = ({
  filterIndex,
  fieldLabel,
  fieldType = 'text',
  values,
  applyFilter,
  options = [],
}: {
  filterIndex: number
  fieldLabel: string
  fieldType: 'text' | 'date'
  values: FilterValues
  applyFilter: ApplyFilterFunction
  options: string[]
}) => {
  const truthyValues = values.filter(value => value)
  const useTypeahead = fieldType === 'text'

  console.log(Date.now(), 'values in FilterPanel', values.length, values)

  useEffect(() => {
    // TODO: Use Typeahead component's svg prop
    /** Workaround for fixing colors */
    const typeaheadIcon = Array.from(
      document.querySelectorAll<HTMLElement>('form input[type=search] + div')
    )?.[0]
    if (typeaheadIcon) typeaheadIcon.style.filter = 'invert(1)'
  }, [])

  const handleTypeaheadChange = (items: TypeaheadItem[]) => {
    applyFilter(
      filterIndex,
      items.map(({ label }) => label)
    )
  }

  return (
    <>
      {useTypeahead ? (
        <InputLabel>
          <FieldName>{fieldLabel}</FieldName>
          <FilterTypeahead
            values={truthyValues}
            options={options}
            handleTypeaheadChange={handleTypeaheadChange}
          />
        </InputLabel>
      ) : (
        <InputLabel>
          <FieldName>{fieldLabel}</FieldName>
          <FieldInput
            type={fieldType}
            defaultValue={values.join(',')}
            onInput={(e: React.ChangeEvent<HTMLInputElement>) =>
              applyFilter(filterIndex, [e.target.value])
            }
          />
        </InputLabel>
      )}
    </>
  )
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
const FieldSelectorButton = styled(FilterPanelButton)`
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
  applyFilter,
  height,
  optionsForFields,
}: {
  isFilterPanelOpen: boolean
  setIsFilterPanelOpen: Dispatch<SetStateAction<boolean>>
  filters: Filter[]
  setFilters: Dispatch<SetStateAction<Filter[]>>
  clearFilters: () => void
  /** Event handler for when one of the filter input elements receives new input */
  applyFilter: ApplyFilterFunction
  height: string
  optionsForFields: Record<string, string[]>
}) => {
  const [isFieldSelectorOpen, setIsFieldSelectorOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  // height is a 'calc()' expression
  const filterListHeight = height.replace(')', ' - 73px)')
  const filterListRef = useRef<HTMLUListElement>(null)

  console.log(
    Date.now(),
    'on FilterPanel render, filters =',
    filters.map(filter => filter.values.length),
    structuredClone(filters)
  )

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
