import React, { Dispatch, SetStateAction, useRef, useState } from 'react'
import styled from 'styled-components'
import { Field, Filter } from './constants'
import FilterPanelToolbar from './FilterPanelToolbar'

const mobileBreakpoint = 768

const Panel = styled.aside<{ open: boolean }>`
  backdrop-filter: blur(12px);
  background-color: ${({ theme }) => theme.lightBlack};
  color: ${({ theme }) => theme.white};
  display: flex;
  flex-flow: column nowrap;
  margin-left: ${({ open }) => (open ? '30px' : '-400px')};
  transition: margin-left 300ms cubic-bezier(0.4, 0, 0.2, 1);
  z-index: ${({ theme }) => theme.zIndexes.dataPanel};
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
  filters,
}: {
  isFilterPanelOpen: boolean
  setIsFilterPanelOpen: Dispatch<SetStateAction<boolean>>
  fields: Record<string, Field>
  filters: Filter[]
}) => {
  const [isFieldSelectorOpen, setIsFieldSelectorOpen] = useState(false)
  const idsOfAddedFields = filters.map(({ fieldId }) => fieldId)
  for (const fieldId in fields) {
    fields[fieldId].addedToPanel = idsOfAddedFields.includes(fieldId)
  }

  return (
    <Panel
      open={isFilterPanelOpen}
      className="pharos-panel"
      style={{ colorScheme: 'dark' }}
      onClick={_ => {
        setIsFilterPanelOpen(false)
      }}
    >
      <FilterPanelToolbar
        {...{
          fields,
          filters,
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
