import React, {
  Dispatch,
  SetStateAction,
  RefObject,
  forwardRef,
  useEffect,
  useRef,
  useState,
} from 'react'
import debounce from 'lodash/debounce'
import type { Filter } from 'pages/data'
import {
  DateInputRow,
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
  const startDateRef = useRef(null)
  const endDateRef = useRef(null)

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
    startDateRef,
    endDateRef,
  }
  const someValuesAreInvalid = filter.validities?.some(validity => !validity)
  return (
    <FilterLabel>
      <FieldName>{filter.label}</FieldName>
      <DateInputRow>
        <DateInput
          {...dateInputProps}
          index={0}
          value={filter.values?.[0]}
          ref={startDateRef}
          placeholder="From"
        />
        <DateInput
          {...dateInputProps}
          index={1}
          value={filter.values?.[1]}
          ref={endDateRef}
          placeholder="To"
        />
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
  placeholder: string
  startDateRef: RefObject<HTMLInputElement>
  endDateRef: RefObject<HTMLInputElement>
}

const DateInput = forwardRef<HTMLInputElement, DateInputProps>(
  (
    {
      filter,
      earliestPossibleDate,
      latestPossibleDate,
      value,
      index,
      updateFilter,
      updateFilterDebounced,
      setFilters,
      placeholder,
      startDateRef,
      endDateRef,
    },
    ref
  ) => {
    const [showPlaceholder, setShowPlaceholder] = useState(true)
    return (
      <div>
        <FieldInput
          ref={ref}
          type={showPlaceholder ? 'text' : 'date'}
          aria-label={filter.label}
          min={earliestPossibleDate}
          max={latestPossibleDate}
          defaultValue={value}
          placeholder={placeholder}
          onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
            console.log('onInput')
            const valid = e.target.checkValidity()
            const newValues = filter.values ?? []
            if (valid) {
              newValues[index] = e.target.value
            } else {
              newValues[index] = undefined
            }
            const getValidities = () => {
              if (e && e.target) {
                const validities = [
                  startDateRef.current?.checkValidity(),
                  endDateRef.current?.checkValidity(),
                ]
                return validities
              } else {
                return [undefined, undefined]
              }
            }
            if (valid) {
              updateFilter(filter.fieldId, newValues, getValidities)
              updateFilterDebounced.cancel()
            } else {
              // When marking a date as invalid, debounce so that the field isn't
              // eagerly marked invalid as the user begins to type a valid date.
              // Check the validity again in the callback to avoid using a stale
              // value.
              updateFilterDebounced(filter.fieldId, newValues, getValidities)
            }
          }}
          onFocus={(_e: React.FocusEvent<HTMLInputElement>) => {
            setShowPlaceholder(false)
            // If this date field is focused and the previous field is a date
            // field with a tooltip, move that tooltip out of the way
            setFilters(prev =>
              prev.map(f => {
                return f.panelIndex === filter.panelIndex - 1 &&
                  f.type === 'date' &&
                  f.validities?.some(validity => !validity)
                  ? { ...f, tooltipOrientation: 'top' }
                  : f
              })
            )
            return true
          }}
          onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
            if (!e.target.value) setShowPlaceholder(true)
            setFilters(prev =>
              prev.map(f =>
                f.type === 'date' ? { ...f, tooltipOrientation: 'bottom' } : f
              )
            )
          }}
        />
      </div>
    )
  }
)

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
  getValidities?: () => (boolean | undefined)[]
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
    getValidities
  ) => {
    setFilters(prev =>
      prev.map((filter: Filter) =>
        filter.fieldId === fieldId
          ? {
              ...filter,
              values: newValues,
              validities: getValidities?.(),
            }
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
