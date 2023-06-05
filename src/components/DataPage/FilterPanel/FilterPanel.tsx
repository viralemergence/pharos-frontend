import React, {
  MutableRefObject,
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react'
import styled from 'styled-components'
import {
  Field,
  FieldName,
  Filter,
  FilterValues,
  UpdateFilterFunction,
} from './constants'
import InputLabel from '../../ui/InputLabel'
import FilterTypeahead from './FilterTypeahead'
import FilterPanelToolbar from './FilterPanelToolbar'
import { TypeaheadRefGetters } from '../../../../library/ui/typeahead/Typeahead'

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

const Panel = styled.aside<{ isFilterPanelOpen: boolean }>`
  backdrop-filter: blur(12px);
  background-color: ${({ theme }) => theme.lightBlack};
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.4);
  color: #fff;
  height: calc(100vh - 210px);
  left: 30px;
  margin-right: 30px;
  position: relative;
  top: 73px;
  width: 400px;
  z-index: 3;
  @media (max-width: 768px) {
    background-color: ${({ theme }) => theme.lightBlack};
    bottom: 0;
    height: auto;
    left: 0;
    margin-right: 0;
    position: absolute;
    top: 60px;
    width: 100vw;
    z-index: 10;
  }
`

const FieldInput = styled.input`
  ${({ theme }) => theme.smallParagraph};
  background-color: #202020;
  border-radius: 5px;
  border: 1px solid #fff;
  color: #fff;
  font-weight: 600;
  padding: 8px 10px;
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
  typeaheadRefGetters,
}: {
  filterIndex: number
  fieldLabel: string
  fieldType: 'text' | 'date'
  values: FilterValues
  updateFilter: UpdateFilterFunction
  options: string[] | undefined
  typeaheadRefGetters: MutableRefObject<TypeaheadRefGetters>
}) => {
  const useTypeahead = fieldType === 'text'
  const truthyValues = values.filter(value => value)
  const props = {
    fieldLabel,
    values: truthyValues,
    options,
    updateFilter,
    filterIndex,
  }
  if (useTypeahead)
    return <FilterTypeahead {...props} ref={typeaheadRefGetters} />
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

const FilterList = styled.ul`
  height: calc(100vh - 190px - 73px);
  margin: 0;
  overflow-y: auto;
  padding: 34px 40px;
  @media (max-width: 768px) {
    height: calc(100vh - 60px - 73px);
  }
  @media (max-width: 480px) {
    padding: 34px 20px;
  }
`

const FilterPanel = ({
  isFilterPanelOpen,
  setIsFilterPanelOpen,
  fields,
  filters,
  setFilters,
  clearFilters,
  updateFilter,
}: {
  isFilterPanelOpen: boolean
  setIsFilterPanelOpen: Dispatch<SetStateAction<boolean>>
  fields: Record<string, Field>
  filters: Filter[]
  setFilters: Dispatch<SetStateAction<Filter[]>>
  clearFilters: () => void
  /** Event handler for when one of the filter input elements receives new input */
  updateFilter: UpdateFilterFunction
}) => {
  const [isFieldSelectorOpen, setIsFieldSelectorOpen] = useState(false)

  const filterListRef = useRef<HTMLUListElement | null>(null)

  const idsOfAddedFields = filters.map(({ fieldId }) => fieldId)
  for (const fieldId in fields) {
    fields[fieldId].addedToPanel = idsOfAddedFields.includes(fieldId)
  }

  // Disable filter animations when FilterPanel first renders
  const shouldAnimateFilters = useRef(false)

  useEffect(() => {
    // Enable filter animations after FilterPanel first renders
    setTimeout(() => {
      // TODO: Test removing the setTimeout because it might not be needed. Or
      // use a requestAnimationFrame.
      shouldAnimateFilters.current = true
    }, 500)
  }, [])

  useEffect(() => {
    setInterval(() => {
      //
    }, 100)
  }, [])

  const typeaheadRefGetters = null as TypeaheadRefGetters | null

  return (
    <Panel
      style={{ colorScheme: 'dark' }}
      isFilterPanelOpen={isFilterPanelOpen}
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
          <FilterList ref={filterListRef}>
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
                    typeaheadRefGetters={typeaheadRefGetters}
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
