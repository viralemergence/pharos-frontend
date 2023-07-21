import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react'
import styled from 'styled-components'
import { PlusIcon, BackIcon, XIcon, Field } from './constants'
import Dropdown from '@talus-analytics/library.ui.dropdown'

const FilterPanelToolbarNav = styled.nav`
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  padding-bottom: 20px;
  padding: 14px 30px;
  position: relative;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 1px 30px 0px;
  @media (max-width: ${({ theme }) => theme.breakpoints.tabletMaxWidth}) {
    justify-content: flex-start;
    padding: 10px 20px;
  }
`
const FieldSelectorMessage = styled.div`
  ${props => props.theme.smallParagraph};
  padding: 10px 15px;
  color: ${({ theme }) => theme.white};
`
const FilterPanelButton = styled.button`
  ${props => props.theme.smallParagraph};
  padding: 10px 15px;
  text-align: left;
  background-color: transparent;
  color: ${({ theme }) => theme.white};
  border: 0;
  cursor: pointer;
  &:hover {
    background-color: ${({ theme }) => theme.white20PercentOpacity};
  }
`
const FilterPanelToolbarButton = styled(FilterPanelButton)<{
  isFieldSelectorOpen?: boolean
}>`
  border-radius: 5px;
  ${({ isFieldSelectorOpen }) =>
    !isFieldSelectorOpen
      ? 'border-bottom-left-radius: 5px; border-bottom-right-radius: 5px;'
      : ''}
  background-color: ${({ isFieldSelectorOpen, theme }) =>
    isFieldSelectorOpen ? theme.white20PercentOpacity : 'transparent'};
  &:active {
    outline: 2px solid ${({ theme }) => theme.darkGray};
  }
`
const FilterPanelCloseButton = styled(FilterPanelToolbarButton)`
  @media (min-width: ${({ theme }) => theme.breakpoints.laptopMinWidth}) {
    position: absolute;
    right: 2px;
    top: 2px;
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.tabletMaxWidth}) {
    margin-right: 20px;
  }
  border-radius: 50%;
  background: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px;
  &:hover {
    background: inherit;
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.tabletMaxWidth}) {
    width: 45px;
  }
`

const FieldSelectorDiv = styled.div`
  position: absolute;
  width: 348px;
  top: 15px;
  display: flex;
  flex-flow: column nowrap;
  align-items: flex-start;
  background-color: ${({ theme }) => theme.medBlack};
  border-radius: 5px;
  padding: 5px 0;
  @media (max-width: ${({ theme }) => theme.breakpoints.tabletMaxWidth}) {
    top: 11px;
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.mobileMaxWidth}) {
    width: 250px;
  }
`
const FieldSelectorButton = styled(FilterPanelButton)<{ disabled: boolean }>`
  width: 100%;
  padding: 5px 15px;
  margin-bottom: 5px;
  ${({ disabled, theme }) =>
    disabled
      ? `color: ${theme.veryDarkGray};
        cursor: unset;
        &:hover { background-color: inherit; }`
      : `
        &:hover {
          background-color: ${theme.medGray};
          color: ${theme.medBlack};
        }
        &:active { 
          outline: 1px solid ${theme.mint};
        }
    `}
`
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

const FilterPanelCloseButtonWithBackIcon = styled(FilterPanelCloseButton)`
  display: none;
  @media (max-width: ${({ theme }) => theme.breakpoints.tabletMaxWidth}) {
    display: flex;
  }
`

const FilterPanelCloseButtonWithXIcon = styled(FilterPanelCloseButton)`
  @media (max-width: ${({ theme }) => theme.breakpoints.tabletMaxWidth}) {
    margin-left: auto;
    margin-right: 0;
  }
`

const FilterPanelToolbar = ({
  fields,
  isFilterPanelOpen,
  setIsFilterPanelOpen,
}: {
  fields: Record<string, Field>
  isFilterPanelOpen: boolean
  setIsFilterPanelOpen: Dispatch<SetStateAction<boolean>>
}) => {
  const closeFieldSelector = () => {
    setDropdownKey(generateDropdownKey())
  }

  const generateDropdownKey = () => Math.random().toString(36).substring(7)
  const [dropdownKey, setDropdownKey] = useState(generateDropdownKey())

  const addFilterButtonRef = useRef<HTMLButtonElement>(null)

  const closeFieldSelectorIfClickedOutside = (e: MouseEvent) => {
    if (
      addFilterButtonRef.current &&
      !addFilterButtonRef.current.contains(e.target as Node)
    ) {
      closeFieldSelector()
    }
  }

  const closeFieldSelectorOnWindowClick = () => {
    window.addEventListener('click', closeFieldSelectorIfClickedOutside)
  }
  const noLongerCloseFieldSelectorOnWindowClick = () => {
    window.removeEventListener('click', closeFieldSelectorIfClickedOutside)
  }

  const closeFilterPanel = () => {
    setIsFilterPanelOpen(false)
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
          onClick={() => closeFilterPanel()}
          aria-label="Close the Filters panel"
        >
          <BackIcon />
        </FilterPanelCloseButtonWithBackIcon>
        <Dropdown
          key={dropdownKey} // This is used to reset the component as a means of closing it
          expanderStyle={{}}
          onOpen={() => closeFieldSelectorOnWindowClick()}
          onClose={() => noLongerCloseFieldSelectorOnWindowClick()}
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
            onClick={() => {
              closeFieldSelector()
            }}
            addFilterValueSetter={_fieldId => {
              // Code that adds an input or Typeahead will go here in a downstream PR
            }}
            fields={fields}
          />
        </Dropdown>
        <FilterPanelCloseButtonWithXIcon
          onClick={() => closeFilterPanel()}
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

const ScreenReaderOnly = styled.div`
  clip-path: inset(50%);
  clip: rect(0 0 0 0);
  height: 0px;
  overflow: hidden;
  position: absolute;
  width: 0px;
`

export default FilterPanelToolbar
