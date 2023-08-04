import React, { Dispatch, SetStateAction } from 'react'
import type { Filter } from 'pages/data'
import { Panel } from './DisplayComponents'
import FilterPanelToolbar from './FilterPanelToolbar'

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
  return (
    <Panel
      open={isFilterPanelOpen}
      style={{ colorScheme: 'dark' }}
      role="form"
      aria-hidden={isFilterPanelOpen ? 'false' : 'true'}
      aria-label="Filters panel"
      id="pharos-filter-panel"
    >
      <FilterPanelToolbar
        isFilterPanelOpen={isFilterPanelOpen}
        setIsFilterPanelOpen={setIsFilterPanelOpen}
        filters={filters}
        setFilters={setFilters}
      />
      {/* List of added filters will go here */}
    </Panel>
  )
}

export default FilterPanel
