import React, { Dispatch, SetStateAction, useState } from 'react'
import styled from 'styled-components'
import { Field } from './constants'
import FilterPanelToolbar from './FilterPanelToolbar'

const mobileBreakpoint = 768

const Panel = styled.aside<{ open: boolean }>`
  backdrop-filter: blur(12px);
  background-color: ${({ theme }) => theme.lightBlack};
  color: ${({ theme }) => theme.white};
  display: flex;
  flex-flow: column nowrap;
  margin-left: ${({ open }) => (open ? '30px' : '-400px')};
  min-width: 400px;
  transition: margin-left 300ms cubic-bezier(0.4, 0, 0.2, 1);
  z-index: ${({ theme }) => theme.zIndexes.dataPanel};
  position: relative;
  @media (max-width: ${mobileBreakpoint}px) {
    background-color: ${({ theme }) => theme.lightBlack};
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
  const [isFieldSelectorOpen, setIsFieldSelectorOpen] = useState(false)

  return (
    <Panel
      open={isFilterPanelOpen}
      style={{ colorScheme: 'dark' }}
      onClick={_ => {
        setIsFieldSelectorOpen(false)
      }}
    >
      <FilterPanelToolbar
        {...{
          fields,
          isFieldSelectorOpen,
          setIsFieldSelectorOpen,
          setIsFilterPanelOpen,
        }}
      />
      {/* FilterList will go here */}
    </Panel>
  )
}

export default FilterPanel
