import React from 'react'
import styled from 'styled-components'

export enum View {
  map = 'map',
  globe = 'globe',
  table = 'table',
}

const DataToolbarButton = styled.button<{
  selected?: boolean
  width?: number
  extraStyle?: string
}>`
  ${({ theme }) => theme.bigParagraph};
  z-index: ${({ theme }) => theme.zIndexes.dataToolbarButton};
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
  margin-right: 5px;
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
  ${props => props.extraStyle}
`

const DataToolbarRadioButton = styled(DataToolbarButton)``
const DataToolbarButtonContainer = styled.div`
  background-color: ${({ theme }) => theme.white20PercentOpacity};
  border-radius: 10px;
  position: relative;
  backdrop-filter: blur(3px);
  border: 1px solid ${({ theme }) => theme.white10PercentOpacity};
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.124);
`
const DataToolbarRadioButtonContainer = styled(DataToolbarButtonContainer)`
  padding: 5px;
`
const DataToolbarDiv = styled.div<{ isFilterPanelOpen: boolean }>`
  padding: 20px 0 0 30px;
  z-index: ${({ theme }) => theme.zIndexes.dataToolbar};
  display: flex;
  flex-flow: row wrap;
  gap: 1rem;
  flex-basis: 60px;
  @media (max-width: 768px) {
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
  setIsFilterPanelOpen: (open: boolean) => void
  view: View
  changeView: (view: View) => void
}) => {
  const ViewRadioButton = ({
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

  return (
    <DataToolbarDiv isFilterPanelOpen={isFilterPanelOpen}>
      <DataToolbarButtonContainer>
        <DataToolbarButton
          selected={isFilterPanelOpen}
          onClick={() => {
            setIsFilterPanelOpen(!isFilterPanelOpen)
          }}
          width={100}
          aria-controls="pharos-filter-panel"
        >
          Filters
        </DataToolbarButton>
      </DataToolbarButtonContainer>
      <DataToolbarRadioButtonContainer>
        <ViewRadioButton forView={View.map} label="Map" />
        <ViewRadioButton forView={View.globe} label="Globe" />
        <ViewRadioButton forView={View.table} label="Table" />
      </DataToolbarRadioButtonContainer>
    </DataToolbarDiv>
  )
}

export default DataToolbar
