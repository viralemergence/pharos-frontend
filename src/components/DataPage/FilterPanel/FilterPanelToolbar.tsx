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
import { Field, Filter } from '../constants'

interface FieldSelectorProps {
  fields: Record<string, Field>
  addFilterValueSetter: (fieldId: string) => void
  onClick?: (e?: React.MouseEvent<HTMLDivElement>) => void
}

const FieldSelector = ({
  fields,
  addFilterValueSetter,
  onClick = () => null,
}: FieldSelectorProps) => {
  return (
    <FieldSelectorDiv onClick={onClick}>
      {Object.entries(fields).map(
        ([fieldId, { label, addedToPanel = false }]) => (
          <FieldSelectorButton
            key={fieldId}
            value={fieldId}
            onClick={_ => {
              addFilterValueSetter(fieldId)
            }}
            disabled={addedToPanel}
            aria-label={`Add filter for ${label}`}
          >
            {label}
          </FieldSelectorButton>
        )
      )}
      {Object.entries(fields).length === 0 && (
        <FieldSelectorMessage>Loading&hellip;</FieldSelectorMessage>
      )}
    </FieldSelectorDiv>
  )
}

const FilterPanelToolbar = ({
  fields,
  filters,
  setFilters,
  isFilterPanelOpen,
  setIsFilterPanelOpen,
  filterListRef,
}: {
  fields: Record<string, Field>
  filters: Filter[]
  setFilters: Dispatch<SetStateAction<Filter[]>>
  setIsFilterPanelOpen: Dispatch<SetStateAction<boolean>>
  isFilterPanelOpen: boolean
  filterListRef: MutableRefObject<HTMLUListElement | null>
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

  const wasFilterPanelOpen = useRef(isFilterPanelOpen)
  useEffect(() => {
    if (!wasFilterPanelOpen.current && isFilterPanelOpen) {
      // If the panel just opened, focus the add filter button
      addFilterButtonRef.current?.focus()
      const announcement = screenReaderAnnouncementRef.current
      if (announcement) {
        if (!announcement.textContent?.startsWith('Filters panel opened'))
          announcement.textContent = 'Filters panel opened'
        // Always add an extra space to force screen readers to read the announcement
        announcement.textContent += '\xa0'
      }
    }
    wasFilterPanelOpen.current = isFilterPanelOpen
  }, [isFilterPanelOpen])

  const screenReaderAnnouncementRef = useRef<HTMLDivElement>(null)

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
            addFilterValueSetter={fieldId => {
              closeFieldSelector()
              if (fields[fieldId].type !== 'date') {
                // For now, do not handle filters other than dates
                //return
              }
              setFilters(filters => [...filters, { fieldId, values: [] }])
              const filterList = filterListRef.current
              setTimeout(() => {
                if (filterList) filterList.scrollTop = filterList.scrollHeight
              }, 0)
            }}
            fields={fields}
          />
        </Dropdown>
        {filters.length > 0 && (
          <FilterPanelToolbarButton
            style={{ marginRight: '5px' }}
            onClick={() => setFilters([])}
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
