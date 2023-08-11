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
  DateTooltip,
  FieldInput,
  FieldName,
  FilterLabel,
  FilterListItemElement,
  ListOfAddedFilters,
  Panel,
} from './DisplayComponents'
import FilterPanelToolbar from './FilterPanelToolbar'
import FilterTypeahead from './FilterTypeahead'

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
      console.log('canceling debounce on unmount')
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
        />
        <DateInput
          {...dateInputProps}
          index={1}
          value={filter.values?.[1]}
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
}

const DateInput = ({
  filter,
  earliestPossibleDate,
  latestPossibleDate,
  value,
  index,
  updateFilter,
  updateFilterDebounced,
  setFilters,
  placeholder,
}: DateInputProps) => {
  const isDateValid = (dateStr?: string) => {
    if (!dateStr) return undefined
    if (earliestPossibleDate) if (dateStr < earliestPossibleDate) return false
    if (latestPossibleDate) if (dateStr > latestPossibleDate) return false
    return true
  }
  // TODO: temporarily false
  const [showPlaceholder, setShowPlaceholder] = useState(true)
  const changeDate = (index: number, newValue: string | undefined) => {
    console.log('changeDate @', Date.now(), newValue)
    const newValues = filter.values ?? [undefined, undefined]
    // Don't save a blank value
    if (!newValue) newValue = undefined
    newValues[index] = newValue
    if (isDateValid(value)) {
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

  // function sleep(ms) {
  //   return new Promise(resolve => setTimeout(resolve, ms))
  // }

  // // for testing purposes
  // useEffect(() => {
  //   if (index > 0) return
  //   const keyDownHandler = async e => {
  //     console.log('keydown')
  //     if (e.key === 't') {
  //       console.log('changeDate(index, 0199-01-01)')
  //       changeDate(index, '0001-01-01')
  //       await sleep(110)
  //       changeDate(index, '0019-01-01')
  //       await sleep(101)
  //       changeDate(index, '0199-01-01')
  //       await sleep(517)
  //       console.log('changeDate(index, 1995-01-01)')
  //       changeDate(index, '1995-01-01')
  //       await sleep(50)
  //       const panel = document.querySelector('aside[role=form]') as HTMLElement
  //       panel?.focus()

  //       // Clean up
  //       await sleep(1000)
  //       changeDate(index, '')
  //     }
  //   }
  //   window.addEventListener('keydown', keyDownHandler)
  //   return () => {
  //     window.removeEventListener('keydown', keyDownHandler)
  //   }
  // }, [])

  return (
    <div>
      <FieldInput
        type={'date'}
        aria-label={filter.label}
        min={earliestPossibleDate}
        max={latestPossibleDate}
        defaultValue={value}
        placeholder={placeholder}
        showPlaceholder={showPlaceholder}
        onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
          changeDate(index, e.target.value)
        }}
        onFocus={(_e: React.FocusEvent<HTMLInputElement>) => {
          // I was able to comment out this whole onFocus function and it still crashes - but I think less often
          setShowPlaceholder(prev => {
            console.log('**** set showPlaceholder')
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
          // console.log('onblur 1')
          // if (!e.target.value) setShowPlaceholder(true)
          // console.log('onblur 2')
          // setFilters(prev => {
          //   console.log('onblur setFilters 1')
          //   return prev.map(f =>
          //     f.type === 'date' ? { ...f, tooltipOrientation: 'bottom' } : f
          //   )
          // })
          // console.log('onblur 3')
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
  const useTypeahead = filter.type === 'text'
  if (useTypeahead) return <FilterTypeahead {...props} />
  else return <DateFilterInputs {...props} />
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

export type UpdateFilterFunction = (
  fieldId: string,
  newFilterValues: (string | undefined)[],
  isDateValid?: (date?: string) => boolean | undefined
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
    console.log('update filter')
    setFilters(prev => {
      console.log('**** setFilters')
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
      // TODO: Temporary
      onClick={e => console.log('PANEL CLICKED')}
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
