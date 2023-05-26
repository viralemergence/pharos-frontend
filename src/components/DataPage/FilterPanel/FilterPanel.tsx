import React, {
  useEffect,
  useState,
  useRef,
  Dispatch,
  SetStateAction,
} from 'react'
import styled from 'styled-components'
import {
  FieldName,
  Field,
  Filter,
  FilterValues,
  UpdateFilterFunction,
} from './constants'
import InputLabel from '../../ui/InputLabel'
import FilterTypeahead from './FilterTypeahead'
import FilterPanelToolbar from './FilterPanelToolbar'

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

const Panel = styled.aside<{ isFilterPanelOpen: boolean; height: string }>`
  background-color: rgba(51, 51, 51, 0.9);
  color: #fff;
  height: ${props => props.height};
  position: relative;
  width: 410px;
  top: 73px;
  left: 30px;
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
  options: string[] | undefined
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

const FilterListItemElement = styled.li<{ opacity: number }>`
  list-style: none;
  margin-bottom: 20px;
  opacity: ${({ opacity }) => opacity};
  transition: opacity 0.25s;
  &:last-child {
    margin-bottom: 0;
  }
`
const FilterListItem = ({
  shouldAnimate,
  children,
}: {
  shouldAnimate: boolean
  children: React.ReactNode
}) => {
  const [opacity, setOpacity] = useState(shouldAnimate ? 0 : 1)
  useEffect(() => {
    setOpacity(1)
  }, [])
  return (
    <FilterListItemElement opacity={opacity}>{children}</FilterListItemElement>
  )
}

const FilterList = styled.ul<{ height: string }>`
  margin: 0;
  padding: 34px 40px;
  overflow-y: auto;
  height: ${props => props.height};
`

const FilterPanel = ({
  isFilterPanelOpen,
  setIsFilterPanelOpen,
  fields,
  filters,
  setFilters,
  clearFilters,
  updateFilter,
  height,
}: {
  isFilterPanelOpen: boolean
  setIsFilterPanelOpen: Dispatch<SetStateAction<boolean>>
  fields: Record<string, Field>
  filters: Filter[]
  setFilters: Dispatch<SetStateAction<Filter[]>>
  clearFilters: () => void
  /** Event handler for when one of the filter input elements receives new input */
  updateFilter: UpdateFilterFunction
  height: string
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

  // Disable filter animations when FilterPanel first renders
  const shouldAnimateFilters = useRef(false)

  useEffect(() => {
    // Enable filter animations after FilterPanel first renders
    setTimeout(() => {
      shouldAnimateFilters.current = true
    }, 500)
  }, [])

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
          <FilterPanelToolbar
            {...{
              fields,
              filters,
              setFilters,
              clearFilters,
              isFieldSelectorOpen,
              setIsFieldSelectorOpen,
              setIsFilterPanelOpen,
              filterListRef,
            }}
          />
          <FilterList ref={filterListRef} height={filterListHeight}>
            {filters.map((filter, filterIndex) => {
              const { label = '', type = 'text' } = fields[filter.fieldId]
              return (
                <FilterListItem
                  shouldAnimate={shouldAnimateFilters.current}
                  key={`${filter.fieldId}-${filterIndex}`}
                >
                  <FilterValueSetter
                    filterIndex={filterIndex}
                    fieldLabel={label}
                    fieldType={type}
                    options={fields[filter.fieldId].options}
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
