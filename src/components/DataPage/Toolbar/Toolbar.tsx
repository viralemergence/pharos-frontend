import React, { useEffect, useRef } from 'react'
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
}: {
  isFilterPanelOpen: boolean
  setIsFilterPanelOpen: React.Dispatch<React.SetStateAction<boolean>>
  view: View
  changeView: (view: View) => void
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
  const wasFilterPanelOpenRef = useRef(false)
  useEffect(() => {
    // If the panel just closed, focus the launcher
    if (wasFilterPanelOpenRef.current && !isFilterPanelOpen) {
      filterPanelLauncherRef.current?.focus()
    }
    if (isFilterPanelOpen) {
      wasFilterPanelOpenRef.current = true
    }
  }, [isFilterPanelOpen])

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
