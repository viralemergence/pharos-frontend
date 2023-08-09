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
  DateTooltip,
  ListOfAddedFilters,
  Panel,
} from './DisplayComponents'
import FilterPanelToolbar from './FilterPanelToolbar'

/** Localize a date without changing the time zone */
const localizeDate = (dateString: string) => {
  const [year, month, day] = dateString.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  return date.toLocaleDateString()
}

const FilterInput = ({
  filter,
  updateFilter,
  setFilters,
}: {
  filter: Filter
  updateFilter: UpdateFilterFunction
  setFilters: Dispatch<SetStateAction<Filter[]>>
}) => {
  const values = filter.values ?? []
  const updateFilterDebounced = debounce(updateFilter, 2000)

  useEffect(() => {
    // Cancel debounce on unmount
    return () => {
      updateFilterDebounced.cancel()
    }
  }, [])

  let earliestAllowableDate,
    latestAllowableDate,
    earliestAllowableDateLocalized,
    latestAllowableDateLocalized
  if (filter.earliestDateUsed) {
    earliestAllowableDate = `${filter.earliestDateUsed.slice(0, 2)}00-01-01`
    earliestAllowableDateLocalized = localizeDate(earliestAllowableDate)
  }
  if (filter.latestDateUsed) {
    latestAllowableDate = `${
      Number(filter.latestDateUsed.slice(0, 2)) + 1
    }00-01-01`
    latestAllowableDateLocalized = localizeDate(latestAllowableDate)
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
          const checkValidity = () => {
            if (e && e.target && e.target.checkValidity) {
              return e.target.checkValidity()
            } else {
              return false
            }
          }
          if (valid) {
            updateFilter(filter.fieldId, values, checkValidity)
            updateFilterDebounced.cancel()
          } else {
            // When marking a date as invalid, debounce so that the field isn't
            // eagerly marked invalid as the user begins to type a valid date.
            // Check the validity again in the callback to avoid using a stale
            // value.
            updateFilterDebounced(filter.fieldId, values, checkValidity)
          }
        }}
        onFocus={(_e: React.FocusEvent<HTMLInputElement>) => {
          // If this date field is focused and the previous field is a date
          // field with a tooltip, move that tooltip out of the way
          setFilters(prev =>
            prev.map(f => {
              return f.panelIndex === filter.panelIndex - 1 &&
                f.type === 'date' &&
                f.inputIsValid === false
                ? { ...f, tooltipOrientation: 'top' }
                : f
            })
          )
        }}
        onBlur={(_e: React.FocusEvent<HTMLInputElement>) => {
          setFilters(prev =>
            prev.map(f =>
              f.type === 'date' ? { ...f, tooltipOrientation: 'bottom' } : f
            )
          )
        }}
      />
      {filter.inputIsValid === false && (
        <DateTooltip flipped={filter.tooltipOrientation === 'top'}>
          Date must be between{' '}
          <span style={{ whiteSpace: 'nowrap' }}>
            {earliestAllowableDateLocalized}
          </span>{' '}
          and{' '}
          <span style={{ whiteSpace: 'nowrap' }}>
            {latestAllowableDateLocalized}
          </span>
        </DateTooltip>
      )}
    </FilterLabel>
  )
}

const FilterUI = ({
  filter,
  updateFilter,
  setFilters,
}: {
  filter: Filter
  updateFilter: UpdateFilterFunction
  setFilters: Dispatch<SetStateAction<Filter[]>>
}) => {
  const truthyValues = (filter.values ?? []).filter(value => value)
  const props = {
    filter: { ...filter, values: truthyValues },
    updateFilter,
    setFilters,
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

type UpdateFilterFunction = (
  fieldId: string,
  newFilterValues: string[],
  getValidity?: () => boolean
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

  const addedFilters = filters
    .filter(f => f.addedToPanel)
    .sort((a, b) => a.panelIndex - b.panelIndex)

  const updateFilter: UpdateFilterFunction = (
    fieldId,
    newValues,
    getValidity?: () => boolean
  ) => {
    setFilters(prev =>
      prev.map((filter: Filter) =>
        filter.fieldId === fieldId
          ? { ...filter, values: newValues, inputIsValid: getValidity?.() }
          : filter
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
                  <FilterUI
                    filter={filter}
                    updateFilter={updateFilter}
                    setFilters={setFilters}
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
