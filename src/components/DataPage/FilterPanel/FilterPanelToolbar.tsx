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
  addFilterValueSetter,
  onClick = () => null,
}: {
  filters: Filter[]
  setIsDropdownOpen: Dispatch<SetStateAction<boolean>>
  addFilterValueSetter: (options: Partial<Filter>) => void
  onClick?: (e?: React.MouseEvent<HTMLDivElement>) => void
}) => {
  return (
    <FilterAdderDiv onClick={onClick}>
      {filters.map(({ fieldId, type, label, addedToPanel = false }) => (
        <AddFilterToPanelButtonStyled
          key={fieldId}
          onClick={_ => {
            addFilterValueSetter({ fieldId, type })
            setIsDropdownOpen(false)
          }}
          disabled={addedToPanel}
          aria-label={`Add filter for ${label}`}
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
            addFilterValueSetter={({ fieldId, type }) => {
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
            isFilterAdderOpen={isDropdownOpen} // TODO: this seems not right
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
    </>
  )
}

export default FilterPanelToolbar
