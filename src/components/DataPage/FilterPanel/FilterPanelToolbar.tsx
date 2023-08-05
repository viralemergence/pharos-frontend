import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react'
import Dropdown from './Dropdown'

import {
  PlusIcon,
  BackIcon,
  XIcon,
  FilterPanelToolbarNav,
  FilterPanelToolbarButton,
  FilterPanelCloseButtonWithXIcon,
  FilterPanelCloseButtonWithBackIcon,
  FieldSelectorDiv,
  FieldSelectorButton,
  FieldSelectorMessage,
} from './DisplayComponents'
import type { Filter } from 'pages/data'

interface FieldSelectorProps {
  filters: Filter[]
  setIsDropdownOpen: Dispatch<SetStateAction<boolean>>
}

const FieldSelector = ({ filters, setIsDropdownOpen }: FieldSelectorProps) => {
  return (
    <FieldSelectorDiv>
      {filters.map(({ fieldId, label }) => (
        <FieldSelectorButton
          key={fieldId}
          aria-label={`Add filter for ${label}`}
          onClick={() => {
            console.log('closing dropdown')
            setIsDropdownOpen(false)
          }}
        >
          {label}
        </FieldSelectorButton>
      ))}
      {filters.length === 0 && (
        <FieldSelectorMessage>Loading&hellip;</FieldSelectorMessage>
      )}
    </FieldSelectorDiv>
  )
}

const FilterPanelToolbar = ({
  filters,
  isFilterPanelOpen,
  setIsFilterPanelOpen,
}: {
  filters: Filter[]
  setIsFilterPanelOpen: Dispatch<SetStateAction<boolean>>
  isFilterPanelOpen: boolean
}) => {
  const addFilterButtonRef = useRef<HTMLButtonElement>(null)

  // TODO: Copy the Dropdown component into a separate file next to this one,
  // modify it so that the expander closes when the user clicks outside the
  // button/expander, and then I can focus the Add filter button when that
  // button mounts.
  //
  // TODO: Look for more examples of this "reaching for prior state" pattern
  // and move away from that.

  useEffect(() => {
    if (isFilterPanelOpen) {
      // If the panel just opened, focus the add filter button
      addFilterButtonRef.current?.focus()
    }
  }, [isFilterPanelOpen])

  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  return (
    <>
      <FilterPanelToolbarNav>
        <FilterPanelCloseButtonWithBackIcon
          onClick={() => setIsFilterPanelOpen(false)}
          aria-label="Close the Filters panel"
        >
          <BackIcon />
        </FilterPanelCloseButtonWithBackIcon>
        <Dropdown
          open={isDropdownOpen}
          setOpen={setIsDropdownOpen}
          expanderStyle={{}}
          renderButton={(open: boolean) => (
            <FilterPanelToolbarButton
              style={{ marginRight: 'auto' }}
              isFieldSelectorOpen={open}
              ref={addFilterButtonRef}
            >
              <PlusIcon style={{ marginRight: '5px' }} /> Add filter
            </FilterPanelToolbarButton>
          )}
          animDuration={0}
        >
          <FieldSelector
            filters={filters}
            setIsDropdownOpen={setIsDropdownOpen}
          />
        </Dropdown>
        <FilterPanelCloseButtonWithXIcon
          onClick={() => setIsFilterPanelOpen(false)}
          aria-label="Close the Filters panel"
        >
          <XIcon extraStyle="width: 18px; height: 18px;" />
        </FilterPanelCloseButtonWithXIcon>
      </FilterPanelToolbarNav>
    </>
  )
}

export default FilterPanelToolbar
