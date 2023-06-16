import React, { Dispatch, MutableRefObject, SetStateAction } from 'react'
import styled from 'styled-components'
import { PlusIcon, BackIcon, XIcon, Field, Filter } from './constants'

const FilterPanelToolbarNav = styled.nav`
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  padding-bottom: 20px;
  padding: 14px 40px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  @media (max-width: 768px) {
    padding: 14px 20px;
  }
`
const FieldSelectorMessage = styled.div`
  ${props => props.theme.smallParagraph};
  padding: 10px 15px;
  color: rgba(255, 255, 255, 0.8);
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
    background-color: #333;
  }
`
const FilterPanelToolbarButton = styled(FilterPanelButton)<{
  isFieldSelectorOpen?: boolean
}>`
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  ${({ isFieldSelectorOpen }) =>
    !isFieldSelectorOpen
      ? 'border-bottom-left-radius: 5px; border-bottom-right-radius: 5px;'
      : ''}
  &:hover {
    background-color: #202020;
  }
  background-color: ${({ isFieldSelectorOpen }) =>
    isFieldSelectorOpen ? '#202020' : 'rgba(0,0,0,0)'};
  &:active {
    outline: 2px solid rgba(100, 100, 100, 1);
    transform: scale(0.99);
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
  top: 60px;
  width: calc(100% - 79px);
  left: 40px;
  display: flex;
  flex-flow: column nowrap;
  align-items: flex-start;
  background-color: #202020;
  border-radius: 5px;
  border-top-left-radius: 0;
  padding: 5px 0;
  z-index: ${({ theme }) => theme.zIndexes.dataPanelFieldSelector};
`
const FieldSelectorButton = styled(FilterPanelButton)<{ disabled: boolean }>`
  width: 100%;
  ${({ disabled, theme }) =>
    disabled
      ? 'color: #777; cursor: unset; &:hover { background-color: inherit; }'
      : `
        &:hover { background-color: #36a49d; }
        &:active { outline: 1px solid ${theme.mint}; }
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
  filters,
  setFilters,
  clearFilters,
  isFieldSelectorOpen,
  setIsFieldSelectorOpen,
  setIsFilterPanelOpen,
  filterListRef,
}: {
  fields: Record<string, Field>
  filters: Filter[]
  setFilters: Dispatch<SetStateAction<Filter[]>>
  clearFilters: () => void
  isFieldSelectorOpen: boolean
  setIsFieldSelectorOpen: Dispatch<SetStateAction<boolean>>
  setIsFilterPanelOpen: Dispatch<SetStateAction<boolean>>
  filterListRef: MutableRefObject<HTMLUListElement | null>
}) => {
  return (
    <>
      <FilterPanelToolbarNav>
        <FilterPanelCloseButton
          className="close-panel back-icon"
          onClick={() => setIsFilterPanelOpen(false)}
          aria-label="Close the filters panel"
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
          aria-label="Add filter"
        >
          <PlusIcon style={{ marginRight: '5px' }} /> Add filter
        </FilterPanelToolbarButton>
        {filters.length > 0 && (
          <FilterPanelToolbarButton onClick={() => clearFilters()}>
            Clear all
          </FilterPanelToolbarButton>
        )}
        <FilterPanelCloseButton
          className="close-panel x-icon"
          onClick={() => setIsFilterPanelOpen(false)}
          aria-label="Close the filters panel"
        >
          <XIcon extraStyle="width: 18px; height: 18px;" />
        </FilterPanelCloseButton>
      </FilterPanelToolbarNav>
      {isFieldSelectorOpen && (
        <FieldSelector
          addFilterValueSetter={fieldId => {
            setFilters(filters => [...filters, { fieldId, values: [] }])
            setIsFieldSelectorOpen(false)
            const filterList = filterListRef.current
            setTimeout(() => {
              if (filterList) filterList.scrollTop = filterList.scrollHeight
            }, 0)
          }}
          fields={fields}
        />
      )}
    </>
  )
}

export default FilterPanelToolbar
