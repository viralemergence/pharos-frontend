import React, { Dispatch, SetStateAction } from 'react'
import styled from 'styled-components'
import { Field } from './constants'
import FilterPanelToolbar from './FilterPanelToolbar'

const panelWidth = '410px'

const Panel = styled.aside<{ open: boolean }>`
  // TODO: Double check that this blur amount is correct
  pointer-events: auto;
  backdrop-filter: blur(47px);
  background-color: ${({ theme }) => theme.white10PercentOpacity};
  border: 1px solid ${({ theme }) => theme.white10PercentOpacity};
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  color: ${({ theme }) => theme.white};
  display: flex;
  flex-flow: column nowrap;
  margin-left: ${({ open }) => (open ? '30px' : `-${panelWidth}`)};
  width: min(${panelWidth}, 100%);
  max-width: ${panelWidth};
  position: relative;
  transition: margin-left 300ms cubic-bezier(0.4, 0, 0.2, 1);
  @media (max-width: ${({ theme }) => theme.breakpoints.tabletMaxWidth}) {
    transition: none;
    backdrop-filter: blur(100px);
    border-radius: 0;
    border: 0;
    display: ${({ open }) => (open ? 'block' : 'none')};
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: 0;
    height: 100%;
    margin-right: 0;
    position: absolute;
    width: 100vw;
    max-width: unset;
  }
`

const FilterPanel = ({
  isFilterPanelOpen,
  setIsFilterPanelOpen,
  fields,
}: {
  isFilterPanelOpen: boolean
  setIsFilterPanelOpen: Dispatch<SetStateAction<boolean>>
  fields: Record<string, Field>
}) => {
  return (
    <Panel
      open={isFilterPanelOpen}
      style={{ colorScheme: 'dark' }}
      role="navigation"
      aria-hidden={isFilterPanelOpen ? 'false' : 'true'}
      aria-label="Filters panel"
      id="pharos-filter-panel"
    >
      <FilterPanelToolbar
        fields={fields}
        isFilterPanelOpen={isFilterPanelOpen}
        setIsFilterPanelOpen={setIsFilterPanelOpen}
      />
      {/* FilterList will go here */}
    </Panel>
  )
}

export default FilterPanel
