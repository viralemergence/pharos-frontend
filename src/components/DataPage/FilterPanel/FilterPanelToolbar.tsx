import React, { Dispatch, SetStateAction } from 'react'
import styled from 'styled-components'
import { PlusIcon, BackIcon, XIcon, Field } from './constants'

const FilterPanelToolbarNav = styled.nav`
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  padding-bottom: 20px;
  padding: 14px 30px;
  position: relative;
  border-bottom: 1px solid rgba(0, 0, 0, 0.3);
  box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.3);
  @media (max-width: ${({ theme }) => theme.breakpoints.tabletMaxWidth}) {
    padding: 14px 20px;
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
  color: #fff;
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
  &.add-filter {
    margin-right: auto;
  }
  @media (max-width: 768px) {
    &.close-panel {
      &:active {
        transform: scale(0.92);
      }
    }
  }
`
const FilterPanelCloseButton = styled(FilterPanelToolbarButton)`
  @media (min-width: 768px) {
    position: absolute;
    right: 2px;
    top: 2px;
  }
  @media (max-width: 768px) {
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
  &.back-icon {
    display: none !important;
  }
  @media (max-width: 768px) {
    width: 45px;
    height: 45px;
    &.x-icon {
      display: none;
    }
    &.back-icon {
      display: flex !important;
    }
  }
`
const FieldSelectorDiv = styled.div`
  position: absolute;
  top: 70px;
  width: calc(100% - 59px);
  left: 30px;
  display: flex;
  flex-flow: column nowrap;
  align-items: flex-start;
  background-color: ${({ theme }) => theme.medBlack};
  border-radius: 5px;
  padding: 5px 0;
  z-index: ${({ theme }) => theme.zIndexes.dataPanelFieldSelector};
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

const FieldSelector = ({
  fields,
  addFilterValueSetter,
}: {
  fields: Record<string, Field>
  addFilterValueSetter: (fieldId: string) => void
}) => {
  return (
    <FieldSelectorDiv
      onClick={e => {
        // If this click event propagates, the panel's click handler will
        // fire, closing the field selector.
        e.stopPropagation()
      }}
    >
      {Object.entries(fields).map(
        ([fieldId, { label, addedToPanel = false }]) => (
          <FieldSelectorButton
            key={fieldId}
            value={fieldId}
            onClick={_ => {
              addFilterValueSetter(fieldId)
            }}
            disabled={addedToPanel}
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
  isFieldSelectorOpen,
  setIsFieldSelectorOpen,
  setIsFilterPanelOpen,
}: {
  fields: Record<string, Field>
  isFieldSelectorOpen: boolean
  setIsFieldSelectorOpen: Dispatch<SetStateAction<boolean>>
  setIsFilterPanelOpen: Dispatch<SetStateAction<boolean>>
}) => {
  return (
    <>
      <FilterPanelToolbarNav>
        <FilterPanelCloseButton
          className="close-panel back-icon"
          onClick={() => setIsFilterPanelOpen(false)}
          aria-label="Close the Filters panel"
        >
          <BackIcon />
        </FilterPanelCloseButton>
        <FilterPanelToolbarButton
          className="add-filter"
          isFieldSelectorOpen={isFieldSelectorOpen}
          onClick={e => {
            setIsFieldSelectorOpen(open => !open)
            // If this click event propagates, the panel's click handler will
            // fire, closing the field selector.
            e.stopPropagation()
          }}
        >
          <PlusIcon style={{ marginRight: '5px' }} /> Add filter
        </FilterPanelToolbarButton>
        <FilterPanelCloseButton
          className="close-panel x-icon"
          onClick={() => setIsFilterPanelOpen(false)}
          aria-label="Close the Filters panel"
        >
          <XIcon extraStyle="width: 18px; height: 18px;" />
        </FilterPanelCloseButton>
      </FilterPanelToolbarNav>
      {isFieldSelectorOpen && (
        <FieldSelector
          addFilterValueSetter={_fieldId => {
            setIsFieldSelectorOpen(false)
          }}
          fields={fields}
        />
      )}
    </>
  )
}

export default FilterPanelToolbar
