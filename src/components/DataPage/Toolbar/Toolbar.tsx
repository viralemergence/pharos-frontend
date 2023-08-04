import React, { useEffect, useRef } from 'react'
import type { Filter } from 'pages/data'
import {
  FilterPanelLauncher,
  DataToolbarRadioButton,
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
    <DataToolbarRadioButton
      selected={view === forView}
      onClick={() => changeView(forView)}
    >
      {label}
    </DataToolbarRadioButton>
  )

  const filterPanelLauncherRef = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    if (!isFilterPanelOpen) {
      // If the panel just closed, focus the launcher
      filterPanelLauncherRef.current?.focus()
    }
  }, [isFilterPanelOpen])

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
