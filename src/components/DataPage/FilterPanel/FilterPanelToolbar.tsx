import React, {
  Dispatch,
  MutableRefObject,
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
  addFilterValueSetter: (options: Partial<Filter>) => void
  onClick?: (e?: React.MouseEvent<HTMLDivElement>) => void
}

const FieldSelector = ({
  filters,
  addFilterValueSetter,
  onClick = () => null,
}: FieldSelectorProps) => {
  return (
    <FieldSelectorDiv onClick={onClick}>
      {filters.map(({ fieldId, type, label, addedToPanel = false }) => (
        <FieldSelectorButton
          key={fieldId}
          onClick={_ => {
            addFilterValueSetter({ fieldId, type })
          }}
          disabled={addedToPanel}
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

  const addedFilters = filters.filter(f => f.addedToPanel)

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

  // TODO: Do this without refs
  const wasFilterPanelOpen = useRef(isFilterPanelOpen)
  useEffect(() => {
    if (!wasFilterPanelOpen.current && isFilterPanelOpen) {
      // If the panel just opened, focus the add filter button
      addFilterButtonRef.current?.focus()
      const announcement = screenReaderAnnouncementRef.current
      if (announcement) {
        if (!announcement.textContent?.startsWith('Filters panel opened'))
          announcement.textContent = 'Filters panel opened'
        // Always add an extra space to force screen readers to read the
        // announcement
        announcement.textContent += '\xa0'
      }
    }
    wasFilterPanelOpen.current = isFilterPanelOpen
  }, [isFilterPanelOpen])

  const screenReaderAnnouncementRef = useRef<HTMLDivElement>(null)

  const removeAllFilters = () => {
    setFilters(prev =>
      prev.map(filter => ({
        ...filter,
        applied: false,
        addedToPanel: false,
        values: undefined,
      }))
    )
  }

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
          <FieldSelector
            filters={filters}
            addFilterValueSetter={({ fieldId, type }) => {
              closeFieldSelector()
              if (type !== 'date') {
                // For now, do not handle filters other than dates
                return
              }
              setFilters(filters => {
                const highestPanelIndex = Math.max(
                  ...filters.map(panel => panel.panelIndex)
                )
                return filters.map(f => {
                  if (f.fieldId !== fieldId) return f
                  return {
                    ...f,
                    addedToPanel: true,
                    values: [],
                    panelIndex: highestPanelIndex + 1,
                  }
                })
              })
            }}
          />
        </Dropdown>
        {addedFilters.length > 0 && (
          <FilterPanelToolbarButton
            style={{ marginRight: '5px' }}
            onClick={() => removeAllFilters()}
          >
            Clear all
          </FilterPanelToolbarButton>
        )}
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
