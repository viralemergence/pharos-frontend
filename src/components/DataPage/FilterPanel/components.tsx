import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
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
  filtersToDelete,
  setFilters,
}: {
  filtersToDelete: Filter[]
  setFilters: Dispatch<SetStateAction<Filter[]>>
}) => {
  return (
    <FilterDeleteButtonContainer>
      <FilterDeleteButtonStyled
        onClick={() =>
          filtersToDelete.map(filter => removeOneFilter(filter, setFilters))
        }
      >
        <XIcon extraStyle="width: 16px; height: 16px;" />
      </FilterDeleteButtonStyled>
    </FilterDeleteButtonContainer>
  )
}

export const TypeaheadFilterListItem = ({
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

  return (
    <FilterListItemStyled opacity={opacity}>
      <FilterUIContainerForTypeahead>
        <FilterTypeahead
          filter={filter}
          updateFilter={updateFilter}
          setFilters={setFilters}
        />
      </FilterUIContainerForTypeahead>
    </FilterListItemStyled>
  )
}

export const DateRangeFilterListItem = ({
  startDateFilter,
  endDateFilter,
  updateFilter,
  setFilters,
}: {
  startDateFilter: Filter
  endDateFilter: Filter
  updateFilter: UpdateFilterFunction
  setFilters: Dispatch<SetStateAction<Filter[]>>
}) => {
  const [opacity, setOpacity] = useState(0)
  useEffect(() => {
    setOpacity(1)
  }, [])

  const hasTooltip = !startDateFilter.valid || !endDateFilter.valid
  return (
    <FilterListItemStyled opacity={opacity}>
      <FilterUIContainer hasTooltip={hasTooltip}>
        <DateRange
          startDateFilter={startDateFilter}
          endDateFilter={endDateFilter}
          updateFilter={updateFilter}
          setFilters={setFilters}
        />
      </FilterUIContainer>
    </FilterListItemStyled>
  )
}

type UpdateDateFilterFunction = (filterId: string, dateStr: string) => void

const isDateValid = (dateStr: string, dateMin: string, dateMax: string) => {
  if (!dateStr) return true
  if (dateMin) if (dateStr < dateMin) return false
  if (dateMax) if (dateStr > dateMax) return false
  return true
}

const DateRange = ({
  startDateFilter,
  endDateFilter,
  updateFilter,
  setFilters,
}: {
  startDateFilter: Filter
  endDateFilter: Filter
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
  if (startDateFilter.earliestDateInDatabase) {
    dateMin = `${startDateFilter.earliestDateInDatabase.slice(0, 2)}00-01-01`
  }
  if (startDateFilter.latestDateInDatabase) {
    dateMax = `${
      Number(startDateFilter.latestDateInDatabase.slice(0, 2)) + 1
    }00-01-01`
  }

  const updateDateFilter: UpdateDateFilterFunction = (filterId, dateStr) => {
    const shouldDebounce = !isDateValid(dateStr, dateMin, dateMax)
    const updateOptions = {
      id: filterId,
      newValues: [dateStr],
      // Check the validity in the callback to avoid using a stale value.
      isDateValid: (dateStr: string) => isDateValid(dateStr, dateMin, dateMax),
    }
    if (shouldDebounce) {
      // When marking a date as invalid, debounce so that the field isn't
      // eagerly marked invalid as the user begins to type a valid date.
      updateFilterDebounced(updateOptions)
    } else {
      updateFilter(updateOptions)
      updateFilterDebounced.cancel()
    }
  }

  return (
    <FilterLabel>
      <FieldName>Collection date</FieldName>
      <DateInputRow>
        <DateLabel>
          <span>From</span>
          <DateInput
            filter={startDateFilter}
            initialValue={startDateFilter.values[0]}
            updateDateFilter={updateDateFilter}
            ariaLabel={'Collected on this date or later'}
            dateMin={dateMin}
            dateMax={dateMax}
          />
        </DateLabel>
        <DateLabel>
          <span>To</span>
          <DateInput
            filter={endDateFilter}
            updateDateFilter={updateDateFilter}
            ariaLabel={'Collected on this date or earlier'}
            dateMin={dateMin}
            dateMax={dateMax}
          />
        </DateLabel>
        <FilterDeleteButton
          filtersToDelete={[startDateFilter, endDateFilter]}
          setFilters={setFilters}
        />
      </DateInputRow>
      {(!startDateFilter.valid || !endDateFilter.valid) &&
        dateMin &&
        dateMax && (
          <DateTooltip
            isStartDateInvalid={!startDateFilter.valid}
            isEndDateInvalid={!endDateFilter.valid}
          >
            Dates must be between {localizeDate(dateMin)} and{' '}
            {localizeDate(dateMax)}
          </DateTooltip>
        )}
    </FilterLabel>
  )
}

type DateInputProps = {
  filter: Filter
  dateMin?: string
  dateMax?: string
  updateDateFilter: UpdateDateFilterFunction
  initialValue?: string
  ariaLabel?: string
}

const DateInput = ({
  filter,
  updateDateFilter,
  ariaLabel,
  dateMin = '',
  dateMax = '',
}: DateInputProps) => {
  const [value, setValue] = useState(filter.values[0] || '')

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
          updateDateFilter(filter.id, e.target.value)
        }}
      />
    </div>
  )
}
