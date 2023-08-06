import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react'
import type { Filter } from 'pages/data'
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
  fieldId,
  fieldLabel,
  fieldType,
  values,
  updateFilter,
}: {
  fieldId: string
  fieldLabel: string
  fieldType: string
  values: string[]
  updateFilter: UpdateFilterFunction
}) => {
  return (
    <FilterLabel>
      <FieldName>{fieldLabel}</FieldName>
      <FieldInput
        // This will be a date field if fieldType == 'date'
        type={fieldType}
        aria-label={fieldLabel}
        min={fieldType === 'date' ? '1900-01-01' : undefined}
        max={fieldType === 'date' ? '2200-12-31' : undefined}
        defaultValue={values.join(',')}
        onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
          const values = e.target.checkValidity() ? [e.target.value] : []
          updateFilter(fieldId, values)
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
  fieldId,
  fieldLabel,
  fieldType = 'text',
  values,
  updateFilter,
  options = [],
}: {
  fieldId: string
  fieldLabel: string
  fieldType: 'text' | 'date'
  values: string[]
  updateFilter: UpdateFilterFunction
  options: string[] | undefined
}) => {
  const truthyValues = values.filter(value => value)
  const props = {
    fieldId,
    fieldLabel,
    values: truthyValues,
    options,
    updateFilter,
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

type UpdateFilterFunction = (fieldId: string, newFilterValues: string[]) => void

const FilterPanel = ({
  isFilterPanelOpen,
  setIsFilterPanelOpen,
  filters,
}: {
  isFilterPanelOpen: boolean
  setIsFilterPanelOpen: Dispatch<SetStateAction<boolean>>
  filters: Filter[]
}) => {
  const filterListRef = useRef<HTMLUListElement | null>(null)

  const addedFilters = filters
    .filter(({ addedToPanel }) => addedToPanel)
    .sort((a, b) => a.panelIndex - b.panelIndex)

  const updateFilter: UpdateFilterFunction = (fieldId, newValues) => {
    setFilters(prev =>
      prev.map(filter =>
        filter.fieldId === fieldId ? { ...filter, values: newValues } : filter
      )
    )
  }

  // When a new filter is added, scroll the filter list to the bottom
  useEffect(() => {
    const filterList = filterListRef?.current
    if (filterList) filterList.scrollTop = filterList.scrollHeight
  }, [addedFilters.length])

  return (
    <Panel
      open={isFilterPanelOpen}
      style={{ colorScheme: 'dark' }}
      role="form"
      aria-hidden={isFilterPanelOpen ? 'false' : 'true'}
      aria-label="Filters panel"
      id="pharos-filter-panel" // The filter panel toggle button has aria-controls="pharos-filter-panel"
    >
      {isFilterPanelOpen && (
        <>
          <FilterPanelToolbar
            isFilterPanelOpen={isFilterPanelOpen}
            setIsFilterPanelOpen={setIsFilterPanelOpen}
            filters={filters}
            setFilters={setFilters}
          />
          <ListOfAddedFilters ref={filterListRef}>
            {addedFilters.map(
              ({ fieldId, label, type, options, values = [] }) => {
                return (
                  <FilterListItem key={fieldId}>
                    <FilterValueSetter
                      fieldId={fieldId}
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
        </>
      )}
    </Panel>
  )
}

export default FilterPanel
