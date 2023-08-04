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
  ScreenReaderOnly,
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
  setFilters,
  isFilterPanelOpen,
  setIsFilterPanelOpen,
}: {
  filters: Filter[]
  setFilters: Dispatch<SetStateAction<Filter[]>>
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

  // TODO: Do this without refs
  const wasFilterPanelOpen = useRef(isFilterPanelOpen)

  useEffect(() => {
    if (isFilterPanelOpen) {
      // If the panel just opened, focus the add filter button
      addFilterButtonRef.current?.focus()
      // TODO: See note in src/pages/data.tsx about where to move this logic
      // Pattern to avoid: putting state in refs. Something like
      // setScreenReaderAnnouncement(prev => ...) so that the new state can
      // depend on the old. This is a method of stably depending on prior
      // state. Avoid the 'if this, then that' imperative style.
      const announcement = screenReaderAnnouncementRef.current
      if (announcement) {
        if (!announcement.textContent?.startsWith('Filters panel opened'))
          announcement.textContent = 'Filters panel opened'
        // Always add an extra space to force screen readers to read the
        // announcement
        announcement.textContent += '\xa0'
      }
    }
  }, [isFilterPanelOpen])

  const screenReaderAnnouncementRef = useRef<HTMLDivElement>(null)

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
      <ScreenReaderOnly
        ref={screenReaderAnnouncementRef}
        aria-live="assertive"
      />
    </>
  )
}

export default FilterPanelToolbar
