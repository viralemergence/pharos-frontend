import React, {
  createRef,
  useEffect,
  useRef,
  Dispatch,
  MutableRefObject,
  SetStateAction,
} from 'react'
import styled from 'styled-components'
import { PlusIcon, BackIcon, XIcon, Field, Filter } from './constants'

function getPreviousItemInMap(map: Map, key: string) {
  const keys = map.keys()
  return map.get(keys[Array.from(keys).indexOf(key) - 1])
}

function getNextItemInMap(map: Map, key: string) {
  const index = Array.from(map.keys()).indexOf(key)
  return
  return null
}

const FilterPanelHeading = styled.div`
  ${props => props.theme.smallParagraph};
  display: none;
  padding: 10px 0;
  font-weight: bold;
  margin-right: 20px;
  @media (max-width: 768px) {
    display: flex;
  }
`

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
    @media (min-width: 768px) {
      &::after {
        content: ' filter';
      }
    }
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
  z-index: 1;
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
  const buttons = useRef(
    new Map<string, MutableRefObject<HTMLButtonElement | null>>()
  ).current
  const keyDownHandler = e => {
    console.log(e.key)
  }

  useEffect(() => {
    Object.entries(fields).forEach(([fieldId, _field]) => {
      if (!buttons.has(fieldId)) {
        const buttonRef: MutableRefObject<HTMLButtonElement | null> =
          createRef()
        buttons.set(fieldId, buttonRef)
      }
    })
    // TODO: Work in progress
    setTimeout(() => {
      const firstButtonKey = Array.from(buttons.keys())?.[0]
      const firstButtonRef = buttons.get(firstButtonKey)
      firstButtonRef?.current?.focus()
    })
  }, [fields, buttons])

  return (
    <FieldSelectorDiv
      onClick={e => {
        // If this click event propagates, the panel's click handler will
        // fire, closing the field selector.
        e.stopPropagation()
      }}
      onKeyDown={keyDownHandler}
    >
      {Object.entries(fields).map(
        ([fieldId, { label, addedToPanel = false }]) => (
          <FieldSelectorButton
            ref={buttons.get(fieldId)}
            key={fieldId}
            value={fieldId}
            onClick={_ => {
              addFilterValueSetter(fieldId)
            }}
            tabIndex={-1}
            onKeyDown={e => {
              const keys = Array.from(buttons.keys())
              const focusNeighbor = (delta: number) => {
                const myIndex = keys.indexOf(fieldId)
                const neighborKey = keys[myIndex + delta]
                const neighbor = buttons.get(neighborKey)?.current
                neighbor?.focus()
              }
              if (e.key === 'ArrowUp') focusNeighbor(-1)
              if (e.key === 'ArrowDown') focusNeighbor(1)
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
  // TODO: Remove invisible items from tab order
  return (
    <>
      <FilterPanelToolbarNav>
        <FilterPanelCloseButton
          className="close-panel back-icon"
          onClick={() => setIsFilterPanelOpen(false)}
        >
          <BackIcon />
        </FilterPanelCloseButton>
        <FilterPanelHeading>Filters</FilterPanelHeading>
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
          <PlusIcon style={{ marginRight: '5px' }} /> Add
        </FilterPanelToolbarButton>
        {filters.length > 0 && (
          <FilterPanelToolbarButton onClick={() => clearFilters()}>
            Clear all
          </FilterPanelToolbarButton>
        )}
        <FilterPanelCloseButton
          className="close-panel x-icon"
          onClick={() => setIsFilterPanelOpen(false)}
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
