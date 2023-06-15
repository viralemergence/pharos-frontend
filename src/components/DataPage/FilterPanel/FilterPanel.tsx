import React, {
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
import FilterTypeahead from './FilterTypeahead'
import FilterPanelToolbar from './FilterPanelToolbar'

const Label = styled.label`
  ${({ theme }) => theme.smallParagraph}
  display: block;
`

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
    <Label>
      <FieldName>{fieldLabel}</FieldName>
      <FieldInput
        type={fieldType}
        defaultValue={values.join(',')}
        onInput={(e: React.ChangeEvent<HTMLInputElement>) =>
          updateFilter(filterIndex, [e.target.value])
        }
      />
    </Label>
  )
}

const Panel = styled.aside<{ open: boolean }>`
  backdrop-filter: blur(12px);
  background-color: ${({ theme }) => theme.lightBlack};
  color: #fff;
  display: flex;
  flex-flow: column nowrap;
  margin-left: ${({ open }) => (open ? '30px' : '-400px')};
  transition: margin-left 300ms cubic-bezier(0.4, 0, 0.2, 1);
  z-index: ${({ theme }) => theme.zIndexes.dataPanel};
  @media (max-width: 768px) {
    background-color: ${({ theme }) => theme.lightBlack};
    display: ${({ open }) => (open ? 'block' : 'none')};
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: 0;
    height: 100%;
    margin-right: 0;
    position: absolute;
    width: 100vw;
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
}: {
  filterIndex: number
  fieldLabel: string
  fieldType: 'text' | 'date'
  values: FilterValues
  updateFilter: UpdateFilterFunction
  options: string[] | undefined
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

const FilterList = styled.ul`
  margin: 0;
  overflow-y: auto;
  padding: 34px 40px;
  flex: 1;
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

  return (
    <Panel
      open={isFilterPanelOpen}
      className="pharos-panel"
      style={{ colorScheme: 'dark' }}
      onClick={_ => {
        setIsFieldSelectorOpen(false)
      }}
      role="navigation"
      aria-hidden={isFilterPanelOpen ? 'false' : 'true'}
      id="pharos-filter-panel"
    >
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
              />
            </FilterListItem>
          )
        })}
      </FilterList>
    </Panel>
  )
}

export default FilterPanel
