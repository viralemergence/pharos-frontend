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
  FilterAdderDiv,
  FilterAdderMessage,
  FilterPanelCloseButtonWithBackIcon,
  FilterPanelCloseButtonWithXIcon,
  FilterPanelToolbarButtonStyled,
  FilterPanelToolbarNav,
  PlusIcon,
  XIcon,
} from './DisplayComponents'
import type { Filter } from 'pages/data'

/** Button that adds a filter to the panel */
const AddFilterToPanelButton = ({
  filters,
  setIsDropdownOpen,
}: {
  filters: Filter[]
  setIsDropdownOpen: Dispatch<SetStateAction<boolean>>
}) => {
  return (
    <FilterAdderDiv>
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
        <FilterAdderMessage>Loading&hellip;</FilterAdderMessage>
      )}
    </FilterAdderDiv>
  )
}

const FilterPanelToolbarButton = ({
  isFilterAdderOpen,
  onClick,
  children,
  style,
}: {
  isFilterAdderOpen: boolean
  children: React.ReactNode
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  style?: React.CSSProperties
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    buttonRef.current?.focus()
  }, [])
  return (
    <FilterPanelToolbarButtonStyled
      isFilterAdderOpen={isFilterAdderOpen}
      ref={buttonRef}
      style={style}
      onClick={onClick}
    >
      {children}
    </FilterPanelToolbarButtonStyled>
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
            <FilterPanelToolbarButton
              style={{ marginRight: 'auto' }}
              isFilterAdderOpen={open}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <PlusIcon style={{ marginRight: '5px' }} /> Add filter
            </FilterPanelToolbarButton>
          )}
          animDuration={0}
        >
          <AddFilterToPanelButton
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
