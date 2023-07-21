import React, { useEffect, useRef } from 'react'
import styled from 'styled-components'

export enum View {
  map = 'map',
  globe = 'globe',
  table = 'table',
}

const DataToolbarButton = styled.button<{
  selected?: boolean
  width?: number
}>`
  ${({ theme }) => theme.bigParagraph};
  position: relative;
  font-size: 16px;
  line-height: 25px;
  background: none;
  border: 0;
  background-color: ${({ selected, theme }) =>
    selected ? theme.mint : 'transparent'};
  ${({ selected, theme }) =>
    selected
      ? ''
      : `
      &:hover { background-color: ${theme.white10PercentOpacity}; }
      `}
  color: ${({ selected, theme }) => (selected ? theme.black : theme.white)};
  border-radius: 7px;
  cursor: pointer;
  &:last-child {
    margin-right: 0;
  }
  width: ${({ width }) => (width ? width + 'px' : 'auto')};
  height: 100%;
  padding: 5px 10px;
  &:active {
    outline: 2px solid ${({ theme }) => theme.white20PercentOpacity};
  }
`
const FilterPanelLauncher = styled(DataToolbarButton)`
  padding-left: 10px;
  padding-right: 10px;
  margin-left: 0;
  border-radius: 9px;
`

const DataToolbarRadioButton = styled(DataToolbarButton)``
const DataToolbarButtonContainer = styled.div`
  background-color: ${({ theme }) => theme.white20PercentOpacity};
  border-radius: 10px;
  position: relative;
  display: flex;
  flex-flow: row nowrap;
  gap: 10px;
  backdrop-filter: blur(3px);
  border: 1px solid ${({ theme }) => theme.white10PercentOpacity};
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.124);
`
const ContainerForRadioButtons = styled(DataToolbarButtonContainer)`
  padding: 5px;
`
const ContainerForFilterPanelLauncher = styled(DataToolbarButtonContainer)`
  height: 42px;
`
const DataToolbarDiv = styled.div<{ isFilterPanelOpen: boolean }>`
  padding: 20px 0 0 30px;
  display: flex;
  flex-flow: row wrap;
  gap: 10px;
  flex-basis: 60px;
  align-items: center;
  @media (max-width: ${({ theme }) => theme.breakpoints.tabletMaxWidth}) {
    padding: 10px;
    ${({ isFilterPanelOpen }) => (isFilterPanelOpen ? 'display: none' : '')}
  }
`

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
  const wasFilterPanelOpen = useRef(isFilterPanelOpen)
  useEffect(() => {
    if (wasFilterPanelOpen.current && !isFilterPanelOpen) {
      // If the panel just closed, focus the launcher
      filterPanelLauncherRef.current?.focus()
    }
    wasFilterPanelOpen.current = isFilterPanelOpen
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
