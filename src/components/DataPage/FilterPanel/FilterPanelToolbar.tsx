import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react'
import Dropdown from '@talus-analytics/library.ui.dropdown'

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
  onClick?: (e?: React.MouseEvent<HTMLDivElement>) => void
}

const FieldSelector = ({ filters }: FieldSelectorProps) => {
  return (
    <FieldSelectorDiv>
      {filters.map(({ fieldId, label }) => (
        <FieldSelectorButton
          key={fieldId}
          aria-label={`Add filter for ${label}`}
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

  const generateDropdownKey = () => Math.random().toString(36).substring(7)
  const [dropdownKey, setDropdownKey] = useState(generateDropdownKey())
  const closeFieldSelector = () => {
    setDropdownKey(generateDropdownKey())
  }

  /** Close the field selector if the user clicked somewhere other than the add
   * filter button */
  const closeFieldSelectorIfClickedOutside = (e: MouseEvent) => {
    if (
      addFilterButtonRef.current &&
      !addFilterButtonRef.current.contains(e.target as Node)
    ) {
      closeFieldSelector()
    }
  }

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

  // TODO: Use the useEffect/cleanup pattern to set/unset the click listener on the window

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
          key={dropdownKey} // This is used to reset the component as a means of closing it
          expanderStyle={{}}
          onOpen={() => {
            window?.addEventListener(
              'click',
              closeFieldSelectorIfClickedOutside
            )
          }}
          onClose={() => {
            window?.removeEventListener(
              'click',
              closeFieldSelectorIfClickedOutside
            )
          }}
          renderButton={open => (
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
          <FieldSelector filters={filters} />
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
