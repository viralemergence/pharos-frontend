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

