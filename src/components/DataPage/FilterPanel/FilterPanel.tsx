import React, { useState, useRef, Dispatch, SetStateAction } from 'react'
import styled from 'styled-components'
import { fields, Filter, ApplyFilterFunction } from './constants'
import QueryBuilder from './QueryBuilder'

const Panel = styled.div<{ isFilterPanelOpen: boolean; height: string }>`
  background-color: rgba(51, 51, 51, 0.9);
  color: #fff;
  height: ${props => props.height};
  position: relative;
  width: 410px;
  top: 73px;
  left: 30px;
  border-radius: 10px;
  margin-right: 30px;
  backdrop-filter: blur(2px);
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.4);
  z-index: 3;
`

const FilterPanel = ({
  isFilterPanelOpen,
  setIsFilterPanelOpen,
  filters,
  setFilters,
  clearFilters,
  applyFilter,
  height,
  optionsForFields,
}: {
  isFilterPanelOpen: boolean
  setIsFilterPanelOpen: Dispatch<SetStateAction<boolean>>
  filters: Filter[]
  setFilters: Dispatch<SetStateAction<Filter[]>>
  clearFilters: () => void
  /** Event handler for when one of the filter input elements receives new input */
  applyFilter: ApplyFilterFunction
  height: string
  optionsForFields: Record<string, string[]>
}) => {
  const [isFieldSelectorOpen, setIsFieldSelectorOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  return (
    <Panel
      style={{ colorScheme: 'dark' }}
      className="pharos-panel"
      height={height}
      isFilterPanelOpen={isFilterPanelOpen}
      ref={panelRef}
      onClick={_ => {
        setIsFieldSelectorOpen(false)
      }}
    >
      {isFilterPanelOpen && (
        <QueryBuilder
          fields={fields}
          optionsForFields={optionsForFields}
          filters={filters}
          setFilters={setFilters}
          clearFilters={clearFilters}
          applyFilter={applyFilter}
          isFieldSelectorOpen={isFieldSelectorOpen}
          setIsFieldSelectorOpen={setIsFieldSelectorOpen}
          panelHeight={height}
          setIsFilterPanelOpen={setIsFilterPanelOpen}
        />
      )}
    </Panel>
  )
}

export default FilterPanel
