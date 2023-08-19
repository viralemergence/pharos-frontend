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
          <DateFilterInputs
            filter={filter}
            updateFilter={updateFilter}
            setFilters={setFilters}
          />
        </FilterUIContainer>
      )}
    </FilterListItemStyled>
  )
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
  const updateFilterDebounced = debounce(
    updateFilter,
    dateFilterUpdateDelayInMilliseconds,
    { leading: true, trailing: true }
  )

  useEffect(() => {
    // Cancel debounce on unmount
    return () => {
      updateFilterDebounced.cancel()
    }
  }, [updateFilterDebounced])

  let dateMin: string | undefined, dateMax: string | undefined
  if (filter.earliestDateInDatabase) {
    dateMin = `${filter.earliestDateInDatabase.slice(0, 2)}00-01-01`
  }
  if (filter.latestDateInDatabase) {
    dateMax = `${Number(filter.latestDateInDatabase.slice(0, 2)) + 1}00-01-01`
  }

  const dateInputProps = {
    filterId: filter.id,
    dateMin,
    dateMax,
    updateFilter,
    updateFilterDebounced,
    setFilters,
  }
  const someValuesAreInvalid = filter.validities?.some(
    validity => validity === false
  )
  const [startDate, setStartDate] = useState<string | undefined>(
    filter.values?.[0]
  )
  const [endDate, setEndDate] = useState<string | undefined>(filter.values?.[1])

  const isDateValid = (dateStr?: string) => {
    if (!dateStr) return undefined
    if (dateMin) if (dateStr < dateMin) return false
    if (dateMax) if (dateStr > dateMax) return false
    return true
  }

  const updateDateFilter = (
    newStartDate: string | undefined,
    newEndDate: string | undefined
  ) => {
    const newDates = [newStartDate, newEndDate]
    const bothDatesValid = isDateValid(newStartDate) && isDateValid(newEndDate)
    // Update immediately if both dates are valid, debounce otherwise
    if (bothDatesValid) {
      updateFilter(filter.id, newDates, isDateValid)
      updateFilterDebounced.cancel()
    } else {
      // When marking a date as invalid, debounce so that the field isn't
      // eagerly marked invalid as the user begins to type a valid date.
      // Check the validity again in the callback to avoid using a stale
      // value.
      updateFilterDebounced(filter.id, newDates, isDateValid)
    }
  }

  useEffect(() => {
    updateDateFilter(startDate, endDate)
  }, [startDate, endDate])

  return (
    <FilterLabel>
      <FieldName>{filter.label}</FieldName>
      <DateInputRow>
        <DateLabel>
          <span>From</span>
          <DateInput
            {...dateInputProps}
            initialValue={filter.values?.[0]}
            ariaLabel={'Collected on this date or later'}
            setValue={setStartDate}
          />
        </DateLabel>
        <DateLabel>
          <span>To</span>
          <DateInput
            {...dateInputProps}
            initialValue={filter.values?.[1]}
            ariaLabel={'Collected on this date or earlier'}
            setValue={setEndDate}
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
  setValue: Dispatch<SetStateAction<string | undefined>>
  ariaLabel?: string
  initialValue?: string
}

const DateInput = ({
  dateMin,
  dateMax,
  setValue,
  ariaLabel,
  initialValue,
}: DateInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (inputRef.current && initialValue) {
      inputRef.current.value = initialValue
    }
  }, [inputRef, initialValue])

  return (
    <div>
      <DateInputStyled
        ref={inputRef}
        type={'date'}
        aria-label={ariaLabel}
        min={dateMin}
        max={dateMax}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setValue(e.target.value)
        }}
      />
    </div>
  )
}
