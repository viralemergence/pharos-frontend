import React, { Dispatch, SetStateAction, useEffect, useRef } from 'react'
import type { Filter } from 'pages/data'
import { FilterPanelStyled, ListOfAddedFilters } from './DisplayComponents'
import FilterPanelToolbar from './FilterPanelToolbar'
import { DateRangeFilterUI, TypeaheadFilterUI } from './components'

export type UpdateFilterFunction = (updateFilterOptions: {
  id: string
  newValues: string[]
  isDateValid?: (dateStr: string) => boolean
}) => void

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

  /** Filters that have been added to the panel */
  const addedFilters = filters
    .filter(f => f.addedToPanel)
    .sort((a, b) => a.panelIndex - b.panelIndex)

  const updateFilter: UpdateFilterFunction = ({
    id,
    newValues = [],
    isDateValid,
  }) => {
    setFilters(prev => {
      return prev.map((filter: Filter) => {
        if (filter.id !== id) return filter
        const updatedFilter = { ...filter, values: newValues }
        if (isDateValid !== undefined) {
          updatedFilter.valid = newValues.every(value => isDateValid(value))
        }
        return updatedFilter
      })
    })
  }

  // When a new filter is added, scroll the filter list to the bottom
  /** The last time the number of added filters changed, how many there were */
  const previousLengthOfAddedFilters = useRef(0)
  useEffect(() => {
    if (addedFilters.length > previousLengthOfAddedFilters.current) {
      const filterList = filterListRef?.current
      if (filterList) filterList.scrollTop = filterList.scrollHeight
    }
    previousLengthOfAddedFilters.current = addedFilters.length
  }, [addedFilters.length])

  return (
    <FilterPanelStyled
      open={isFilterPanelOpen}
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
              if (filter.id === 'collection_start_date') {
                return (
                  <DateRangeFilterUI
                    startDateFilter={filter}
                    endDateFilter={
                      filters.find(f => f.id === 'collection_end_date')!
                    }
                    updateFilter={updateFilter}
                    setFilters={setFilters}
                    key={filter.id}
                  />
                )
              }
              if (filter.type === 'text') {
                return (
                  <TypeaheadFilterUI
                    filter={filter}
                    updateFilter={updateFilter}
                    setFilters={setFilters}
                    key={filter.id}
                  />
                )
              }
            })}
          </ListOfAddedFilters>
        </>
      )}
    </FilterPanelStyled>
  )
}

export default FilterPanel
