import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
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

const DateRange = ({
  filter,
  updateFilter,
  setFilters,
}: {
  filter: Filter
  updateFilter: UpdateFilterFunction
  setFilters: Dispatch<SetStateAction<Filter[]>>
}) => {
  console.log('date range rendered')
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
  const [startDate, setStartDate] = useState<string>(filter.values[0])
  const [endDate, setEndDate] = useState<string>(filter.values[1])

  const isDateValid = (dateStr: string) => {
    if (!dateStr) return true
    if (dateMin) if (dateStr < dateMin) return false
    if (dateMax) if (dateStr > dateMax) return false
    return true
  }

  const updateDateFilter = (shouldDebounce: boolean) => {
    const newDates = [startDate, endDate]
    if (shouldDebounce) {
      // When marking a date as invalid, debounce so that the field isn't
      // eagerly marked invalid as the user begins to type a valid date.
      // Check the validity again in the callback to avoid using a stale
      // value.
      updateFilterDebounced(filter.id, newDates, isDateValid)
    } else {
      updateFilter(filter.id, newDates, isDateValid)
      updateFilterDebounced.cancel()
    }
  }

  useEffect(() => {
    updateDateFilter(!isDateValid(startDate))
  }, [startDate])

  useEffect(() => {
    updateDateFilter(!isDateValid(endDate))
  }, [endDate])

  const StartDateInput = useMemo(
    () => (
      <DateInput
        value={startDate}
        setValue={setStartDate}
        ariaLabel={'Collected on this date or later'}
        dateMin={dateMin}
        dateMax={dateMax}
      />
    ),
    [startDate, dateMin, dateMax]
  )

  const EndDateInput = useMemo(
    () => (
      <DateInput
        value={endDate}
        setValue={setEndDate}
        ariaLabel={'Collected on this date or later'}
        dateMin={dateMin}
        dateMax={dateMax}
      />
    ),
    [endDate, dateMin, dateMax]
  )

  return (
    <FilterLabel>
      <FieldName>{filter.label}</FieldName>
      <DateInputRow>
        <DateLabel>
          <span>From</span>
          <StartDateInput />
        </DateLabel>
        <DateLabel>
          <span>To</span>
          <EndDateInput />
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

const DateInput = ({
  dateMin,
  dateMax,
  setValue,
  value,
  ariaLabel,
}: {
  dateMin?: string
  dateMax?: string
  setValue: Dispatch<SetStateAction<string>>
  value: string
  ariaLabel?: string
}) => {
  console.log('dateinput rendered with aria-label', ariaLabel)
  return (
    <div>
      <DateInputStyled
        type={'date'}
        aria-label={ariaLabel}
        min={dateMin}
        max={dateMax}
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setValue(e.target.value)
        }}
      />
    </div>
  )
}
