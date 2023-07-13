import React from 'react'
import styled from 'styled-components'

const Panel = styled.aside<{ open: boolean }>`
  // TODO: Double check that this blur amount is correct
  backdrop-filter: blur(47px);
  background-color: ${({ theme }) => theme.white10PercentOpacity};
  border: 1px solid ${({ theme }) => theme.white10PercentOpacity};
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  color: ${({ theme }) => theme.white};
  display: flex;
  height: 100%;
  flex-flow: column nowrap;
  margin-left: ${({ open }) => (open ? '30px' : '-400px')};
  min-width: min(400px, 100%);
  max-width: 400px;
  position: relative;
  transition: margin-left 300ms cubic-bezier(0.4, 0, 0.2, 1);
  z-index: ${({ theme }) => theme.zIndexes.dataPanel};
  @media (max-width: ${({ theme }) => theme.breakpoints.tabletMaxWidth}) {
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
    // TODO: Should this be 100%?
    width: 100vw;
    max-width: unset;
  }
`

const FilterPanel = ({ isFilterPanelOpen }: { isFilterPanelOpen: boolean }) => {
  return (
    <Panel
      open={isFilterPanelOpen}
      style={{ colorScheme: 'dark' }}
      role="navigation"
      aria-hidden={isFilterPanelOpen ? 'false' : 'true'}
      id="pharos-filter-panel"
    />
  )
}

export default FilterPanel
