import React, { useEffect, useState, useRef } from 'react'
import type { Filter } from 'pages/data'
import {
  FilterPanelLauncher,
  DataToolbarButton,
  ContainerForRadioButtons,
  ContainerForFilterPanelLauncher,
  DataToolbarDiv,
} from '../DisplayComponents'

export enum View {
  map = 'map',
  globe = 'globe',
  table = 'table',
}

export const isView = (str: string): str is View => {
  return Object.values(View).includes(str)
}

const DataToolbar = ({
  isFilterPanelOpen,
  setIsFilterPanelOpen,
  view,
  changeView,
  filters = [],
}: {
  isFilterPanelOpen: boolean
  setIsFilterPanelOpen: React.Dispatch<React.SetStateAction<boolean>>
  view: View
  changeView: (view: View) => void
  filters: Filter[]
}) => {
  const RadioButton = ({
    forView,
    label,
  }: {
    forView: View
    label: string
  }) => (
    <DataToolbarButton
      selected={view === forView}
      onClick={() => changeView(forView)}
    >
      {label}
    </DataToolbarButton>
  )

  const filterPanelLauncherRef = useRef<HTMLButtonElement>(null)
  // Keep track of whether the filter panel was open on last render, to detect
  // when the panel closes.
  const [wasFilterPanelOpen, setWasFilterPanelOpen] = useState(false)
  useEffect(() => {
    // If the panel just closed, focus the launcher. We need to check both that
    // the filter panel is currently closed and also that it was previously
    // open. If we skip the second check, the launcher will be focused when the
    // Toolbar first renders.
    if (wasFilterPanelOpen && !isFilterPanelOpen) {
      filterPanelLauncherRef.current?.focus()
    }
    if (isFilterPanelOpen) {
      setWasFilterPanelOpen(true)
    }
  }, [isFilterPanelOpen, wasFilterPanelOpen])

  const appliedFiltersCount = filters.filter(({ applied }) => applied).length

  return (
    <DataToolbarDiv isFilterPanelOpen={isFilterPanelOpen}>
      <ContainerForFilterPanelLauncher>
        <FilterPanelLauncher
          selected={isFilterPanelOpen}
          ref={filterPanelLauncherRef}
          onClick={() => {
            setIsFilterPanelOpen(prev => !prev)
          }}
          aria-controls="pharos-filter-panel"
        >
          Filters
          {appliedFiltersCount > 0 && (
            <span style={{ marginLeft: '5px' }}>({appliedFiltersCount})</span>
          )}
        </FilterPanelLauncher>
      </ContainerForFilterPanelLauncher>
      <ContainerForRadioButtons>
        <RadioButton forView={View.map} label="Map" />
        <RadioButton forView={View.globe} label="Globe" />
        <RadioButton forView={View.table} label="Table" />
      </ContainerForRadioButtons>
    </DataToolbarDiv>
  )
}

export default DataToolbar
