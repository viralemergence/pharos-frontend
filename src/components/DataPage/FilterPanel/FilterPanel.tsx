import React, { Dispatch, SetStateAction } from 'react'
import type { Filter } from 'pages/data'
import { Panel } from './DisplayComponents'
import FilterPanelToolbar from './FilterPanelToolbar'

const FilterPanel = ({
  isFilterPanelOpen,
  setIsFilterPanelOpen,
  filters,
}: {
  isFilterPanelOpen: boolean
  setIsFilterPanelOpen: Dispatch<SetStateAction<boolean>>
  filters: Filter[]
}) => {
  return (
    <Panel
      open={isFilterPanelOpen}
      style={{ colorScheme: 'dark' }}
      role="form"
      aria-hidden={isFilterPanelOpen ? 'false' : 'true'}
      aria-label="Filters panel"
      id="pharos-filter-panel" // The filter panel toggle button has aria-controls="pharos-filter-panel"
    >
      {isFilterPanelOpen && (
        <>
          <FilterPanelToolbar
            setIsFilterPanelOpen={setIsFilterPanelOpen}
            filters={filters}
          />
          {/* List of added filters will go here */}
        </>
      )}
    </Panel>
  )
}

export default FilterPanel
