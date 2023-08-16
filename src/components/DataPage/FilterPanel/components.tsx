import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import debounce from 'lodash/debounce'
import type { Filter } from 'pages/data'
import {
  DateInputRow,
  DateTooltip,
  FieldInput,
  FieldName,
  FilterDeleteButtonStyled,
  FilterLabel,
  FilterListItemElement,
  FilterUIContainer,
  FilterUIContainerForTypeahead,
  XIcon,
} from './DisplayComponents'
import { removeOneFilter } from './FilterPanelToolbar'
import FilterTypeahead from './FilterTypeahead'
import type { UpdateFilterFunction } from './FilterPanel'

/** Localize a date without changing the time zone */
const localizeDate = (dateString: string) => {
  const [year, month, day] = dateString.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  return date.toLocaleDateString()
}

const dateFilterUpdateDelay = 1000
export const FilterDeleteButton = ({
  filter,
  setFilters,
}: {
  filter: Filter
  setFilters: Dispatch<SetStateAction<Filter[]>>
}) => {
  return (
    <FilterDeleteButtonStyled
      onClick={() => removeOneFilter(filter, setFilters)}
    >
      <XIcon extraStyle="width: 16px; height: 16px;" />
    </FilterDeleteButtonStyled>
  )
}

export const FilterUI = ({
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
  const useTypeahead = filter.type === 'text'
  const hasTooltip = filter.validities?.some(validity => validity === false)
  return useTypeahead ? (
    <FilterUIContainerForTypeahead hasTooltip={hasTooltip}>
      <FilterTypeahead {...props} />
    </FilterUIContainerForTypeahead>
  ) : (
    <FilterUIContainer hasTooltip={hasTooltip}>
      <DateFilterInputs {...props} />
    </FilterUIContainer>
  )
}

export const FilterListItem = ({ children }: { children: React.ReactNode }) => {
  const [opacity, setOpacity] = useState(0)
  useEffect(() => {
    setOpacity(1)
  }, [])
  return (
    <FilterListItemElement opacity={opacity}>{children}</FilterListItemElement>
  )
}

export const DateFilterInputs = ({
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
        <DateInput
          {...dateInputProps}
          index={0}
          value={filter.values?.[0]}
          placeholder="From"
          ariaLabel={'Collected on this date or later'}
        />
        <DateInput
          {...dateInputProps}
          index={1}
          value={filter.values?.[1]}
          placeholder="To"
          ariaLabel={'Collected on this date or earlier'}
        />
        <FilterDeleteButton filter={filter} setFilters={setFilters} />
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

interface DebouncedFunc<T extends (...args: any[]) => any> extends Function {
  (...args: Parameters<T>): ReturnType<T>
  cancel: () => void
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
  ariaLabel?: string
}

export const DateInput = ({
  filter,
  earliestPossibleDate,
  latestPossibleDate,
  value,
  index,
  updateFilter,
  updateFilterDebounced,
  setFilters,
  placeholder,
  ariaLabel,
}: DateInputProps) => {
  const isDateValid = (dateStr?: string) => {
    if (!dateStr) return undefined
    if (earliestPossibleDate) if (dateStr < earliestPossibleDate) return false
    if (latestPossibleDate) if (dateStr > latestPossibleDate) return false
    return true
  }
  const [showPlaceholder, setShowPlaceholder] = useState(true)
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
        defaultValue={value}
        placeholder={placeholder}
        showPlaceholder={showPlaceholder}
        onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
          changeDate(index, e.target.value)
        }}
        onFocus={(_e: React.FocusEvent<HTMLInputElement>) => {
          setShowPlaceholder(() => {
            return false
          })
          // If this date field is focused and the previous field is a date
          // field with a tooltip, move that tooltip out of the way
          setFilters(prev =>
            prev.map(f => {
              return f.panelIndex === filter.panelIndex - 1 &&
                f.type === 'date' &&
                f.validities?.some(validity => validity === false)
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
