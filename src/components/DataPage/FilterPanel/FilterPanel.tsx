import React, {
  Dispatch,
  SetStateAction,
  forwardRef,
  useEffect,
  useRef,
  useState,
} from 'react'
import debounce from 'lodash/debounce'
import type { Filter } from 'pages/data'
import {
  DateInputRow,
  DateInputSeparator,
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

const DateFilterInputs = ({
  filter,
  updateFilter,
  setFilters,
}: {
  filter: Filter
  updateFilter: UpdateFilterFunction
  setFilters: Dispatch<SetStateAction<Filter[]>>
}) => {
  const updateFilterDebounced = debounce(updateFilter, 2000)

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
  const someValuesAreInvalid = filter.validityOfValues?.some(
    validity => !validity
  )
  const startDateRef = useRef(null)
  const endDateRef = useRef(null)
  return (
    <FilterLabel>
      <FieldName>{filter.label}</FieldName>
      <DateInputRow>
        <DateInput
          {...dateInputProps}
          index={0}
          value={filter.values?.[0]}
          ref={startDateRef}
        />
        <DateInputSeparator>to</DateInputSeparator>
        <DateInput
          {...dateInputProps}
          index={1}
          value={filter.values?.[1]}
          ref={endDateRef}
        />
      </DateInputRow>
      {someValuesAreInvalid && (
        <DateTooltip
          flipped={filter.tooltipOrientation === 'top'}
          isStartDateInvalid={filter.validityOfValues?.[0] === false}
          isEndDateInvalid={filter.validityOfValues?.[1] === false}
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
    },
    ref
  ) => {
    return (
      <div>
        <FieldInput
          ref={ref}
          type="date"
          aria-label={filter.label}
          min={earliestPossibleDate}
          max={latestPossibleDate}
          defaultValue={value}
          onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
            const valid = e.target.checkValidity()
            const newValues = filter.values ?? []
            if (valid) {
              newValues[index] = e.target.value
            }
            const getValidityOfValues = () => {
              if (e && e.target) {
                // TODO: Perhaps use refs for simplicity
                const children = Array.from(
                  Array.from(
                    e.target.parentElement?.parentElement?.children ?? []
                  ).flatMap(child => Array.from(child.children))
                )
                const validityOfValues = children.reduce<boolean[]>(
                  (acc, child) =>
                    child instanceof HTMLInputElement
                      ? [...acc, child.checkValidity()]
                      : acc,
                  []
                )
                console.log('validityOfValues', validityOfValues)
                return validityOfValues
              } else {
                return [false, false]
              }
            }
            if (valid) {
              updateFilter(filter.fieldId, newValues, getValidityOfValues)
              updateFilterDebounced.cancel()
            } else {
              // When marking a date as invalid, debounce so that the field isn't
              // eagerly marked invalid as the user begins to type a valid date.
              // Check the validity again in the callback to avoid using a stale
              // value.
              updateFilterDebounced(
                filter.fieldId,
                newValues,
                getValidityOfValues
              )
            }
          }}
          onFocus={(_e: React.FocusEvent<HTMLInputElement>) => {
            // If this date field is focused and the previous field is a date
            // field with a tooltip, move that tooltip out of the way
            setFilters(prev =>
              prev.map(f => {
                return f.panelIndex === filter.panelIndex - 1 &&
                  f.type === 'date' &&
                  f.validityOfValues?.some(validity => !validity)
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
  newFilterValues: string[],
  getValidityOfValues?: () => boolean[]
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
    getValidityOfValues?: () => boolean[]
  ) => {
    setFilters(prev =>
      prev.map((filter: Filter) =>
        filter.fieldId === fieldId
          ? {
              ...filter,
              values: newValues,
              // TODO: Maybe rename 'validities'
              validityOfValues: getValidityOfValues?.(),
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
