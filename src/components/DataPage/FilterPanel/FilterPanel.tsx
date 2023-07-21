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
import FilterPanelToolbar from './FilterPanelToolbar'

const panelWidth = '410px'

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
        // This will be a date field if fieldType == 'date'
        type={fieldType}
        min={fieldType === 'date' ? '1900-01-01' : undefined}
        max={fieldType === 'date' ? '2200-12-31' : undefined}
        defaultValue={values.join(',')}
        onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
          const values = e.target.checkValidity() ? [e.target.value] : []
          updateFilter(filterIndex, values)
        }}
        onPaste={(e: React.ClipboardEvent<HTMLInputElement>) => {
          e.preventDefault()
          if (!(e.target instanceof HTMLInputElement)) return
          const dateParts = e.clipboardData
            .getData('text/plain')
            .split(/[/\-\s]/g)
          if (dateParts.length === 3)
            e.target.value = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`
        }}
      />
    </Label>
  )
}

const Panel = styled.aside<{ open: boolean }>`
  pointer-events: auto;
  position: relative;
  backdrop-filter: blur(47px);
  background-color: ${({ theme }) => theme.white10PercentOpacity};
  border: 1px solid ${({ theme }) => theme.white10PercentOpacity};
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  color: ${({ theme }) => theme.white};
  display: flex;
  height: 100%;
  max-height: 100%;
  flex-flow: column nowrap;
  margin-left: ${({ open }) => (open ? '30px' : `-${panelWidth}`)};
  width: min(${panelWidth}, 100%);
  max-width: ${panelWidth};
  transition: margin-left 300ms cubic-bezier(0.4, 0, 0.2, 1);
  @media (max-width: ${({ theme }) => theme.breakpoints.tabletMaxWidth}) {
    transition: none;
    backdrop-filter: blur(100px);
    border-radius: 0;
    border: 0;
    display: ${({ open }) => (open ? 'flex' : 'none')};
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: 0;
    height: 100%;
    margin-right: 0;
    position: absolute;
    width: 100vw;
    max-width: unset;
  }
`

const FieldInput = styled.input`
  ${({ theme }) => theme.smallParagraph};
  background-color: #202020;
  border-radius: 5px;
  border: 1px solid ${({ theme }) => theme.white};
  color: ${({ theme }) => theme.white};
  font-weight: 600;
  padding: 8px 10px;
  &:invalid {
    border-color: ${({ theme }) => theme.red};
  }

  // TODO: Use this to dim Safari dark mode placeholder better
  // &.blank::-webkit-datetime-edit {
  //   &-day-field,
  //   &-month-field,
  //   &-year-field {
  //     opacity: 0.3;
  //   }
  // }
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
  const truthyValues = values.filter(value => value)
  const props = {
    fieldLabel,
    values: truthyValues,
    options,
    updateFilter,
    filterIndex,
  }
  return <FilterInput {...props} fieldType={fieldType} />

  // NOTE: Later this will become:
  // if (useTypeahead) return <FilterTypeahead {...props} />
  // else return <FilterInput {...props} fieldType={fieldType} />
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
const FilterListItem = ({ children }: { children: React.ReactNode }) => {
  const [opacity, setOpacity] = useState(0)
  useEffect(() => {
    setOpacity(1)
  }, [])
  return (
    <FilterListItemElement opacity={opacity}>{children}</FilterListItemElement>
  )
}

const FilterList = styled.ul`
  position: absolute;
  margin: 0;
  bottom: 0;
  right: 0;
  left: 0;
  overflow-y: auto;
  padding: 34px 40px;
  flex-grow: 1;
  flex-shrink: 1;
  max-height: 100%;
  top: 73px;
  @media (max-width: ${({ theme }) => theme.breakpoints.tabletMaxWidth}) {
    top: 64px;
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.mobileMaxWidth}) {
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
  const filterListRef = useRef<HTMLUListElement | null>(null)

  const idsOfAddedFields = filters.map(({ fieldId }) => fieldId)
  for (const fieldId in fields) {
    fields[fieldId].addedToPanel = idsOfAddedFields.includes(fieldId)
  }

  return (
    <Panel
      open={isFilterPanelOpen}
      style={{ colorScheme: 'dark' }}
      role="form"
      aria-hidden={isFilterPanelOpen ? 'false' : 'true'}
      aria-label="Filters panel"
      id="pharos-filter-panel"
    >
      <FilterPanelToolbar
        fields={fields}
        isFilterPanelOpen={isFilterPanelOpen}
        setIsFilterPanelOpen={setIsFilterPanelOpen}
        filters={filters}
        setFilters={setFilters}
        clearFilters={clearFilters}
        filterListRef={filterListRef}
      />
      <FilterList ref={filterListRef}>
        {filters.map((filter, filterIndex) => {
          const { label = '', type = 'text' } = fields[filter.fieldId]
          return (
            <FilterListItem key={`${filter.fieldId}-${filterIndex}`}>
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
