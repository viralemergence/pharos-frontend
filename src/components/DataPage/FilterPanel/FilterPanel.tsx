import React, { Dispatch, SetStateAction, useEffect, useRef } from 'react'
import type { Filter } from 'pages/data'
import { FilterPanelStyled, ListOfAddedFilters } from './DisplayComponents'
import FilterPanelToolbar from './FilterPanelToolbar'
import { FilterListItem } from './components'

export type UpdateFilterFunction = (updateFilterOptions: {
  id: string
  newValues?: string[]
  valuesUpdateFunction?: (prev: string[]) => string[]
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
    valuesUpdateFunction,
    isDateValid,
  }) => {
    setFilters(prev => {
      return prev.map((filter: Filter) => {
        if (filter.id !== id) return filter
        if (valuesUpdateFunction) {
          newValues = valuesUpdateFunction(filter.values)
        }
        const updatedFilter = { ...filter, values: newValues }
        if (isDateValid) {
          updatedFilter.validities = newValues.map(isDateValid)
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
            {addedFilters.map(filter => (
              <FilterListItem
                filter={filter}
                updateFilter={updateFilter}
                setFilters={setFilters}
                key={filter.id}
              />
            ))}
          </ListOfAddedFilters>
        </>
      )}
    </FilterPanelStyled>
  )
}

export default FilterPanel
