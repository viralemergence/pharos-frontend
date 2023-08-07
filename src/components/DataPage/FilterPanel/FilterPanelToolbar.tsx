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
  FilterSelectorDiv as FilterSelectorDiv,
  FilterSelectorMessage,
  FilterPanelCloseButtonWithBackIcon,
  FilterPanelCloseButtonWithXIcon,
  FilterSelectorLauncherStyled,
  FilterPanelToolbarNav,
  PlusIcon,
  XIcon,
} from './DisplayComponents'
import type { Filter } from 'pages/data'

const FilterSelector = ({
  filters,
  setIsDropdownOpen,
}: {
  filters: Filter[]
  setIsDropdownOpen: Dispatch<SetStateAction<boolean>>
}) => {
  return (
    <FilterSelectorDiv>
      {filters.map(({ fieldId, label }) => (
        <AddFilterToPanelButtonStyled
          key={fieldId}
          aria-label={`Add filter for ${label}`}
          onClick={() => {
            setIsDropdownOpen(false)
          }}
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

const FilterPanelToolbar = ({
  filters,
  setIsFilterPanelOpen,
}: {
  filters: Filter[]
  setIsFilterPanelOpen: Dispatch<SetStateAction<boolean>>
}) => {
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
