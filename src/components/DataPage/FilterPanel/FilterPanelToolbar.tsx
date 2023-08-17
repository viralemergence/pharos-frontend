import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react'
import Dropdown from './Dropdown'

import {
  BackIcon,
  AddFilterToPanelButtonStyled,
  FilterSelectorDiv,
  FilterSelectorMessage,
  FilterPanelCloseButtonWithBackIcon,
  FilterPanelCloseButtonWithXIcon,
  FilterPanelToolbarButtonStyled,
  FilterSelectorLauncherStyled,
  FilterPanelToolbarNav,
  PlusIcon,
  XIcon,
} from './DisplayComponents'
import type { Filter } from 'pages/data'

const FilterSelector = ({
  filters,
  setIsDropdownOpen,
  addFilterUI,
}: {
  filters: Filter[]
  setIsDropdownOpen: Dispatch<SetStateAction<boolean>>
  addFilterUI: (options: Partial<Filter>) => void
}) => {
  return (
    <FilterSelectorDiv>
      {filters.map(({ fieldId, label, addedToPanel = false }) => (
        <AddFilterToPanelButtonStyled
          key={fieldId}
          onClick={_ => {
            addFilterUI({ fieldId })
            setIsDropdownOpen(false)
          }}
          disabled={addedToPanel}
          aria-label={`Add filter for ${label}`}
        >
          {label}
        </AddFilterToPanelButtonStyled>
      ))}
      {filters.length === 0 && (
        <FilterSelectorMessage>Loading&hellip;</FilterSelectorMessage>
      )}
    </FilterSelectorDiv>
  )
}

const FilterSelectorLauncher = ({
  isFilterSelectorOpen,
  onClick,
  children,
}: {
  isFilterSelectorOpen: boolean
  children: React.ReactNode
  onClick?: React.MouseEventHandler<HTMLButtonElement>
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    buttonRef.current?.focus()
  }, [])
  return (
    <FilterSelectorLauncherStyled
      isFilterSelectorOpen={isFilterSelectorOpen}
      ref={buttonRef}
      onClick={onClick}
    >
      {children}
    </FilterSelectorLauncherStyled>
  )
}

const removeAllFilters = (setFilters: Dispatch<SetStateAction<Filter[]>>) => {
  setFilters(prev =>
    prev.map(filter => ({
      ...filter,
      ...filterDefaultProperties,
    }))
  )
}

export const removeOneFilter = (
  filter: Filter,
  setFilters: Dispatch<SetStateAction<Filter[]>>
) => {
  setFilters(prev =>
    prev.map(f => ({
      ...f,
      ...(f.fieldId === filter.fieldId ? filterDefaultProperties : {}),
    }))
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
  isFilterPanelOpen: boolean
  setIsFilterPanelOpen: Dispatch<SetStateAction<boolean>>
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const addFilterButtonRef = useRef<HTMLButtonElement>(null)

  const addedFilters = filters.filter(f => f.addedToPanel)

  useEffect(() => {
    if (isFilterPanelOpen) {
      // If the panel just opened, focus the add filter button
      addFilterButtonRef.current?.focus()
    }
  }, [isFilterPanelOpen])

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
          renderButton={(open: boolean) => (
            <FilterSelectorLauncher
              isFilterSelectorOpen={open}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <PlusIcon style={{ marginRight: '5px' }} /> Add filter
            </FilterSelectorLauncher>
          )}
          animDuration={0}
        >
          <FilterSelector
            filters={filters}
            setIsDropdownOpen={setIsDropdownOpen}
            addFilterUI={({ fieldId }) => {
              setFilters(filters => {
                const highestPanelIndex = Math.max(
                  ...filters.map(panel => panel.panelIndex)
                )
                return filters.map(f => {
                  if (f.fieldId !== fieldId) return f
                  const newlyAddedFilter: Filter = {
                    ...f,
                    addedToPanel: true,
                    values: [],
                    panelIndex: highestPanelIndex + 1,
                  }
                  if (newlyAddedFilter.type === 'date') {
                    newlyAddedFilter.validities = [undefined, undefined]
                  }
                  return newlyAddedFilter
                })
              })
            }}
          />
        </Dropdown>
        {addedFilters.length > 0 && (
          <FilterPanelToolbarButtonStyled
            onClick={e => {
              e.preventDefault()
              removeAllFilters(setFilters)
            }}
          >
            Clear all
          </FilterPanelToolbarButtonStyled>
        )}
        <FilterPanelCloseButtonWithXIcon
          onClick={() => setIsFilterPanelOpen(false)}
          aria-label="Close the Filters panel"
        >
          <XIcon extraStyle="width: 16px; height: 16px;" />
        </FilterPanelCloseButtonWithXIcon>
      </FilterPanelToolbarNav>
    </>
  )
}

/** When a filter is cleared from the panel, it receives these default properties */
export const filterDefaultProperties = {
  values: undefined,
  addedToPanel: false,
  /** When a filter is added to the panel, it receives a new panelIndex (zero
   * or greater), indicating its order in the panel. */
  panelIndex: -1,
  applied: false,
  validities: undefined,
}

export default FilterPanelToolbar
