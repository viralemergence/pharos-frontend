import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react'
import debounce from 'lodash/debounce'
import type { Filter } from 'pages/data'
import {
  DateInputRow,
  DateLabel,
  DateTooltip,
  DateInputStyled,
  FieldName,
  FilterDeleteButtonContainer,
  FilterDeleteButtonStyled,
  FilterLabel,
  FilterListItemStyled,
  FilterUIContainer,
  FilterUIContainerForTypeahead,
  XIcon,
} from './DisplayComponents'

interface DebouncedFunc<T extends (...args: any[]) => any> extends Function {
  (...args: Parameters<T>): ReturnType<T>
  cancel: () => void
}

import FilterTypeahead from './FilterTypeahead'
import { removeOneFilter } from './FilterPanelToolbar'
import type { UpdateFilterFunction } from './FilterPanel'

/** Localize a date without changing the time zone */
const localizeDate = (dateString: string) => {
  const [year, month, day] = dateString.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  return date.toLocaleDateString()
}

const dateFilterUpdateDelayInMilliseconds = 1000

export const FilterDeleteButton = ({
  filter,
  setFilters,
}: {
  filter: Filter
  setFilters: Dispatch<SetStateAction<Filter[]>>
}) => {
  return (
    <FilterDeleteButtonContainer>
      <FilterDeleteButtonStyled
        onClick={() => removeOneFilter(filter, setFilters)}
      >
        <XIcon extraStyle="width: 16px; height: 16px;" />
      </FilterDeleteButtonStyled>
    </FilterDeleteButtonContainer>
  )
}

export const FilterListItem = ({
  filter,
  updateFilter,
  setFilters,
}: {
  filter: Filter
  updateFilter: UpdateFilterFunction
  setFilters: Dispatch<SetStateAction<Filter[]>>
}) => {
  const [opacity, setOpacity] = useState(0)
  useEffect(() => {
    setOpacity(1)
  }, [])

  const useTypeahead = filter.type === 'text'
  const hasTooltip = filter.validities?.some(validity => validity === false)
  return (
    <FilterListItemStyled opacity={opacity}>
      {useTypeahead ? (
        <FilterUIContainerForTypeahead hasTooltip={hasTooltip}>
          <FilterTypeahead
            filter={filter}
            updateFilter={updateFilter}
            setFilters={setFilters}
          />
        </FilterUIContainerForTypeahead>
      ) : (
        <FilterUIContainer hasTooltip={hasTooltip}>
          <DateRange
            filter={filter}
            updateFilter={updateFilter}
            setFilters={setFilters}
          />
        </FilterUIContainer>
      )}
    </FilterListItemStyled>
  )
}

type UpdateDateFilterFunction = (
  filterId: string,
  dateStr: string,
  dateIndex: number,
  dateMin: string,
  dateMax: string,
  updateFilter: UpdateFilterFunction,
  updateFilterDebounced: DebouncedFunc<UpdateFilterFunction>
) => void

const isDateValid = (dateStr: string, dateMin: string, dateMax: string) => {
  if (!dateStr) return true
  if (dateMin) if (dateStr < dateMin) return false
  if (dateMax) if (dateStr > dateMax) return false
  return true
}

const updateDateFilter: UpdateDateFilterFunction = (
  filterId,
  dateStr,
  dateIndex,
  dateMin,
  dateMax,
  updateFilter,
  updateFilterDebounced
) => {
  const shouldDebounce = !isDateValid(dateStr, dateMin, dateMax)
  const updateOptions = {
    id: filterId,
    valuesUpdateFunction: (prevValues: string[]) =>
      dateIndex === 0 ? [dateStr, prevValues[1]] : [prevValues[0], dateStr],
  }
  if (shouldDebounce) {
    // When marking a date as invalid, debounce so that the field isn't
    // eagerly marked invalid as the user begins to type a valid date.
    // Check the validity again in the callback to avoid using a stale
    // value.
    updateFilterDebounced(updateOptions)
  } else {
    updateFilter(updateOptions)
    updateFilterDebounced.cancel()
  }
}

const DateRange = ({
  filter,
  updateFilter,
  setFilters,
}: {
  filter: Filter
  updateFilter: UpdateFilterFunction
  setFilters: Dispatch<SetStateAction<Filter[]>>
}) => {
  const updateFilterDebounced = debounce(
    updateFilter,
    dateFilterUpdateDelayInMilliseconds
  )

  useEffect(() => {
    // Cancel debounce on unmount
    return () => {
      updateFilterDebounced.cancel()
    }
  }, [updateFilterDebounced])

  let dateMin = '',
    dateMax = ''
  if (filter.earliestDateInDatabase) {
    dateMin = `${filter.earliestDateInDatabase.slice(0, 2)}00-01-01`
  }
  if (filter.latestDateInDatabase) {
    dateMax = `${Number(filter.latestDateInDatabase.slice(0, 2)) + 1}00-01-01`
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
            initialValue={filter.values[0]}
            updateDateFilter={updateDateFilter}
            ariaLabel={'Collected on this date or later'}
            dateMin={dateMin}
            dateMax={dateMax}
            index={0}
          />
        </DateLabel>
        <DateLabel>
          <span>To</span>
          <DateInput
            initialValue={filter.values[1]}
            updateDateFilter={updateDateFilter}
            ariaLabel={'Collected on this date or earlier'}
            dateMin={dateMin}
            dateMax={dateMax}
            index={1}
          />
        </DateLabel>
        <FilterDeleteButton filter={filter} setFilters={setFilters} />
      </DateInputRow>
      {someValuesAreInvalid && dateMin && dateMax && (
        <DateTooltip
          isStartDateInvalid={filter.validities?.[0] === false}
          isEndDateInvalid={filter.validities?.[1] === false}
        >
          Dates must be between {localizeDate(dateMin)} and{' '}
          {localizeDate(dateMax)}
        </DateTooltip>
      )}
    </FilterLabel>
  )
}

type DateInputProps = {
  dateMin?: string
  dateMax?: string
  updateDateFilter: UpdateDateFilterFunction
  initialValue?: string
  ariaLabel?: string
  index: number
}

const DateInput = ({
  dateMin,
  dateMax,
  initialValue,
  updateDateFilter,
  ariaLabel,
  index,
}: DateInputProps) => {
  const [value, setValue] = useState(initialValue)
  return (
    <div>
      <DateInputStyled
        type={'date'}
        aria-label={ariaLabel}
        min={dateMin}
        max={dateMax}
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setValue(value)
          updateDateFilter(e.target.value, index)
        }}
      />
    </div>
  )
}
