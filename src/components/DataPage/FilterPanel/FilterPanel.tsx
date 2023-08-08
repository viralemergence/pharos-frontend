import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react'
import debounce from 'lodash/debounce'
import type { Filter } from 'pages/data'
import {
  FieldInput,
  FieldName,
  FilterLabel,
  FilterListItemElement,
  InvalidDateMessage,
  ListOfAddedFilters,
  Panel,
} from './DisplayComponents'
import FilterPanelToolbar from './FilterPanelToolbar'

const FilterInput = ({
  filter,
  updateFilter,
}: {
  filter: Filter
  updateFilter: UpdateFilterFunction
}) => {
  const [valid, setValid] = useState(true)
  console.log('valid', valid)
  const declareValidDebounced = debounce(() => setValid(true), 1000, {
    leading: true,
    trailing: true,
  })
  const declareInvalidDebounced = debounce(() => setValid(false), 1000, {
    leading: false,
    trailing: true,
  })
  const setValidDebounced = (valid: boolean) => {
    if (valid) {
      declareValidDebounced()
      declareInvalidDebounced.cancel()
    } else {
      declareInvalidDebounced()
      declareValidDebounced.cancel()
    }
  }

  // Cancel debouncing in case component unmounts
  useEffect(() => {
    return () => {
      declareValidDebounced.cancel()
      declareInvalidDebounced.cancel()
    }
  }, [])

  const values = filter.values ?? []
  let earliestAllowableDate, latestAllowableDate
  if (filter.earliestDateUsed) {
    earliestAllowableDate = `${filter.earliestDateUsed.slice(0, 2)}00-01-01`
  }
  if (filter.latestDateUsed) {
    latestAllowableDate = `${
      Number(filter.latestDateUsed.slice(0, 2)) + 1
    }00-01-01`
  }
  return (
    <FilterLabel>
      <FieldName>{filter.label}</FieldName>
      <FieldInput
        // This is a date input if filter.type is 'date'
        type={filter.type}
        aria-label={filter.label}
        min={earliestAllowableDate}
        max={latestAllowableDate}
        defaultValue={values.join(',')}
        onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
          const valid = e.target.checkValidity()
          const values = valid ? [e.target.value] : []
          updateFilter(filter.fieldId, values)
        }}
      />
      {!valid && (
        <InvalidDateMessage>
          Date must be between{' '}
          <span style={{ whiteSpace: 'nowrap' }}>{earliestAllowableDate}</span>{' '}
          and{' '}
          <span style={{ whiteSpace: 'nowrap' }}>{latestAllowableDate}</span>
        </InvalidDateMessage>
      )}
    </FilterLabel>
  )
}

const FilterValueSetter = ({
  filter,
  updateFilter,
}: {
  filter: Filter
  updateFilter: UpdateFilterFunction
}) => {
  const truthyValues = filter.values.filter(value => value)
  const props = {
    filter: { ...filter, values: truthyValues },
    updateFilter,
  }
  return <FilterInput {...props} />

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
  setFilters,
}: {
  isFilterPanelOpen: boolean
  setIsFilterPanelOpen: Dispatch<SetStateAction<boolean>>
  filters: Filter[]
  setFilters: Dispatch<SetStateAction<Filter[]>>
}) => {
  const filterListRef = useRef<HTMLUListElement | null>(null)

  const addedFilters = filters
    .filter(f => f.addedToPanel)
    .sort((a, b) => a.panelIndex - b.panelIndex)

  const updateFilter: UpdateFilterFunction = (fieldId, newValues) => {
    setFilters(prev =>
      prev.map((filter: Filter) =>
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
            {addedFilters.map(filter => {
              return (
                <FilterListItem key={filter.fieldId}>
                  <FilterValueSetter
                    filter={filter}
                    updateFilter={updateFilter}
                  />
                </FilterListItem>
              )
            })}
          </ListOfAddedFilters>
        </>
      )}
    </Panel>
  )
}

export default FilterPanel
