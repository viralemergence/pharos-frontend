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
  FilterPanelToolbarButtonStyled,
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

const FilterPanelToolbarButton = ({
  isFieldSelectorOpen,
  onClick,
  children,
  style,
}: {
  isFieldSelectorOpen: boolean
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
      isFieldSelectorOpen={isFieldSelectorOpen}
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
              isFieldSelectorOpen={open}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
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
