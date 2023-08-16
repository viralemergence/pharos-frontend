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
  DateInputRow,
  DateLabel,
  DateTooltip,
  FieldInput,
  FieldName,
  FilterLabel,
  FilterListItemElement,
  ListOfAddedFilters,
  Panel,
} from './DisplayComponents'
import FilterPanelToolbar from './FilterPanelToolbar'

interface DebouncedFunc<T extends (...args: any[]) => any> extends Function {
  (...args: Parameters<T>): ReturnType<T>
  cancel: () => void
}

/** Localize a date without changing the time zone */
const localizeDate = (dateString: string) => {
  const [year, month, day] = dateString.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  return date.toLocaleDateString()
}

// This doesn't seem to affect the timing of the actions that cause a crash
const dateFilterUpdateDelay = 1000

const DateFilterInputs = ({
  filter,
  updateFilter,
  setFilters,
}: {
  filter: Filter
  updateFilter: UpdateFilterFunction
  setFilters: Dispatch<SetStateAction<Filter[]>>
}) => {
  const updateFilterDebounced = debounce(updateFilter, dateFilterUpdateDelay)

  useEffect(() => {
    // Cancel debounce on unmount
    return () => {
      updateFilterDebounced.cancel()
    }
  }, [])

  let earliestPossibleDate,
    latestPossibleDate,
    earliestPossibleDateLocalized,
    latestPossibleDateLocalized
  if (filter.earliestPossibleDate) {
    earliestPossibleDate = `${filter.earliestPossibleDate.slice(0, 2)}00-01-01`
    earliestPossibleDateLocalized = localizeDate(earliestPossibleDate)
  }
  if (filter.latestPossibleDate) {
    latestPossibleDate = `${
      Number(filter.latestPossibleDate.slice(0, 2)) + 1
    }00-01-01`
    latestPossibleDateLocalized = localizeDate(latestPossibleDate)
  }

  const dateInputProps = {
    filter,
    earliestPossibleDate,
    latestPossibleDate,
    earliestPossibleDateLocalized,
    latestPossibleDateLocalized,
    updateFilter,
    updateFilterDebounced,
    setFilters,
    values: filter.values,
  }
  const someValuesAreInvalid = filter.validities?.some(
    validity => validity === false
  )

  return (
    <FilterLabel>
      <FieldName>{filter.label}</FieldName>
      <DateInputRow>
        <DateLabel>
          <span>From</span>
          <DateInput
            {...dateInputProps}
            index={0}
            ariaLabel={'Collected on this date or later'}
          />
        </DateLabel>
        <DateLabel>
          <span>To</span>
          <DateInput
            {...dateInputProps}
            index={1}
            ariaLabel={'Collected on this date or earlier'}
          />
        </DateLabel>
      </DateInputRow>
      {someValuesAreInvalid && (
        <DateTooltip
          flipped={filter.tooltipOrientation === 'top'}
          isStartDateInvalid={filter.validities?.[0] === false}
          isEndDateInvalid={filter.validities?.[1] === false}
        >
          Dates must be between {earliestPossibleDateLocalized} and{' '}
          {latestPossibleDateLocalized}
        </DateTooltip>
      )}
    </FilterLabel>
  )
}

type DateInputProps = {
  filter: Filter
  earliestPossibleDate?: string
  latestPossibleDate?: string
  value?: string
  index: number
  updateFilter: UpdateFilterFunction
  updateFilterDebounced: DebouncedFunc<UpdateFilterFunction>
  setFilters: Dispatch<SetStateAction<Filter[]>>
  ariaLabel?: string
}

const DateInput = ({
  filter,
  earliestPossibleDate,
  latestPossibleDate,
  index,
  updateFilter,
  updateFilterDebounced,
  ariaLabel,
}: DateInputProps) => {
  const isDateValid = (dateStr?: string) => {
    if (!dateStr) return undefined
    if (earliestPossibleDate) if (dateStr < earliestPossibleDate) return false
    if (latestPossibleDate) if (dateStr > latestPossibleDate) return false
    return true
  }
  const changeDate = (index: number, newValue: string | undefined) => {
    const newValues = filter.values ?? [undefined, undefined]
    // Don't save a blank value
    if (!newValue) newValue = undefined
    newValues[index] = newValue
    if (isDateValid(newValue)) {
      updateFilter(filter.fieldId, newValues, isDateValid)
      updateFilterDebounced.cancel()
    } else {
      // When marking a date as invalid, debounce so that the field isn't
      // eagerly marked invalid as the user begins to type a valid date.
      // Check the validity again in the callback to avoid using a stale
      // value.
      updateFilterDebounced(filter.fieldId, newValues, isDateValid)
    }
  }

  return (
    <div>
      <FieldInput
        type={'date'}
        aria-label={ariaLabel}
        min={earliestPossibleDate}
        max={latestPossibleDate}
        onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
          changeDate(index, e.target.value)
        }}
      />
    </div>
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
  return <DateFilterInputs {...props} />

  // NOTE: Later this will become:
  // if (useTypeahead) return <FilterTypeahead {...props} />
  // else return <DateFilterInputs {...props} fieldType={fieldType} />
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
  newFilterValues: (string | undefined)[],
  isDateValid: (date?: string) => boolean | undefined
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
    isDateValid
  ) => {
    setFilters(prev => {
      return prev.map((filter: Filter) => {
        if (filter.fieldId !== fieldId) return filter
        const updatedFilter = {
          ...filter,
          values: newValues,
        }
        if (isDateValid) {
          updatedFilter.validities = newValues.map(isDateValid)
        }
        return updatedFilter
      })
    })
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
