import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import debounce from 'lodash/debounce'
import type { Filter } from 'pages/data'
import {
  DateInputRow,
  DateInputStyled,
  DateLabel,
  DateTooltip,
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

/** Localize a date without changing the time zone
 * @param {string} dateString - String in YYYY-MM-DD format
 * @example localizeDate('2023-01-02')
 * // output (if locale is en-us): '01-02-2023'
 * */
const localizeDate = (dateString: string) => {
  const [year, month, day] = dateString.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  return date.toLocaleDateString()
}

const LocalizedDate = ({
  dateString,
}: {
  /** Date string in YYYY-MM-DD format */
  dateString: string
}) => {
  return <time dateTime={dateString}>{localizeDate(dateString)}</time>
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

export const TypeaheadFilterUI = ({
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

export const DateRangeFilterUI = ({
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
    const valid = isDateValid(dateStr, dateMin, dateMax)
    const updateOptions = {
      id: filterId,
      newValues: [dateStr],
      valid,
    }
    if (valid) {
      updateFilter(updateOptions)
      updateFilterDebounced.cancel()
    } else {
      // If the date is invalid, debounce the update, so that the field isn't
      // eagerly marked invalid while the user is still typing
      updateFilterDebounced(updateOptions)
    }
  }

  const isStartDateInvalid = !startDateFilter.valid
  const isEndDateInvalid = !endDateFilter.valid

  // Used for aria-describedby
  const tooltipId = 'date-range-tooltip'

  const shouldShowInvalidDateTooltip =
    (isStartDateInvalid || isEndDateInvalid) && dateMin && dateMax

  return (
    <FilterLabel>
      <FieldName>Collection date</FieldName>
      <DateInputRow>
        <DateLabel>
          <span>From</span>
          <DateInput
            filter={startDateFilter}
            updateDateFilter={updateDateFilter}
            ariaLabel={'Collected on this date or later'}
            ariaDescribedBy={isStartDateInvalid ? tooltipId : undefined}
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
            ariaDescribedBy={isEndDateInvalid ? tooltipId : undefined}
            dateMin={dateMin}
            dateMax={dateMax}
          />
        </DateLabel>
        <FilterDeleteButton
          filtersToDelete={[startDateFilter, endDateFilter]}
          setFilters={setFilters}
        />
      </DateInputRow>
      {shouldShowInvalidDateTooltip && (
        <DateTooltip
          isStartDateInvalid={isStartDateInvalid}
          isEndDateInvalid={isEndDateInvalid}
          role={'tooltip'}
          id={tooltipId}
        >
          Choose a date between <LocalizedDate dateString={dateMin} /> and{' '}
          <LocalizedDate dateString={dateMax} />
        </DateTooltip>
      )}
      {startDateFilter.values[0] > endDateFilter.values[0] &&
        !shouldShowInvalidDateTooltip && (
          <DateTooltip role={'tooltip'} id={tooltipId}>
            Pick a 'To' date that comes after the 'From' date
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
  ariaDescribedBy?: string
}

const DateInput = ({
  filter,
  updateDateFilter,
  ariaLabel,
  dateMin = '',
  dateMax = '',
  ariaDescribedBy,
}: DateInputProps) => {
  const [value, setValue] = useState(filter.values[0] || '')

  return (
    <DateInputStyled
      type={'date'}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      min={dateMin}
      max={dateMax}
      value={value}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value)
        updateDateFilter(filter.id, e.target.value)
      }}
    />
  )
}
