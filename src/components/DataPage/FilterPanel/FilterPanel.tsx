import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react'
import type { Filter } from 'pages/data'
import sortBy from 'lodash/sortBy'
import {
  FieldName,
  FieldInput,
  ListOfAddedFilters,
  FilterLabel,
  FilterListItemElement,
  Panel,
} from './DisplayComponents'
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
  values: string[]
  updateFilter: UpdateFilterFunction
  filterIndex: number
}) => {
  return (
    <FilterLabel>
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
          if (fieldType === 'date') {
            e.preventDefault()
            if (!(e.target instanceof HTMLInputElement)) return
            const dateParts = e.clipboardData
              .getData('text/plain')
              .split(/[/\-\s]/g)
            if (dateParts.length === 3)
              e.target.value = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`
          }
        }}
      />
    </FilterLabel>
  )
}

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
  values: string[]
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

const FilterListItem = ({ children }: { children: React.ReactNode }) => {
  const [opacity, setOpacity] = useState(0)
  useEffect(() => {
    setOpacity(1)
  }, [])
  return (
    <FilterListItemElement opacity={opacity}>{children}</FilterListItemElement>
  )
}

type UpdateFilterFunction = (
  filterIndex: number,
  newFilterValues: string[]
) => void

const FilterPanel = ({
  isFilterPanelOpen,
  setIsFilterPanelOpen,
  filters,
  setFilters,
}: {
  isFilterPanelOpen: boolean
  setIsFilterPanelOpen: Dispatch<SetStateAction<boolean>>
  filters: Filter[]
  setFilters: Dispatch<SetStateAction<Filter[]>>
}) => {
  const filterListRef = useRef<HTMLUListElement | null>(null)

  const filtersSorted = sortBy(filters, 'panelIndex')

  const updateFilter: UpdateFilterFunction = (
    /* Index of the filter to update. This is the index in the Filters array,
     * not the panelIndex */
    index,
    newValues
  ) => {
    setFilters(prev =>
      prev.map((filter, i) => (index === i ? { ...filter, newValues } : filter))
    )
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
        isFilterPanelOpen={isFilterPanelOpen}
        setIsFilterPanelOpen={setIsFilterPanelOpen}
        filters={filters}
        setFilters={setFilters}
        filterListRef={filterListRef}
      />
      <ListOfAddedFilters ref={filterListRef}>
        {filtersSorted.map(
          ({ fieldId, label, type, options, values = [] }, filterIndex) => {
            return (
              <FilterListItem key={`${fieldId}-${filterIndex}`}>
                <FilterValueSetter
                  filterIndex={filterIndex}
                  fieldLabel={label}
                  fieldType={type}
                  options={options}
                  updateFilter={updateFilter}
                  values={values}
                />
              </FilterListItem>
            )
          }
        )}
      </ListOfAddedFilters>
    </Panel>
  )
}

export default FilterPanel
