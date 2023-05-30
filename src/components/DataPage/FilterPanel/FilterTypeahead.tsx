import React from 'react'
import styled from 'styled-components'
import Typeahead, {
  Item as TypeaheadItem,
} from '../../../../library/ui/typeahead';
import { XIcon, FieldName, FilterValues } from './constants'
import InputLabel from '../../ui/InputLabel'

const TypeaheadResultContainer = styled.span<{ selected?: boolean }>`
  ${({ theme }) => theme.smallParagraph};
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  width: 100%;
  font-size: 16px;
  text-align: left;
  padding: 8px 12px;
  background-color: rgba(0, 50, 100, 0);
  transition: 150ms ease;

  ${({ selected }) => selected && ` font-weight: 800; `}

  &:hover {
    background-color: #49515d
      ${({ selected }) => selected && `background-color: #594141;`};
  }
`

interface RenderItemProps {
  item: TypeaheadItem
  selected?: boolean
}

import removeSVG from '../../../assets/darkTypeaheadRemove.svg'

const DarkTypeaheadResult = ({
  item: { label },
  selected,
}: RenderItemProps) => (
  <TypeaheadResultContainer selected={selected}>
    {label}
    {selected && (
      <img src={removeSVG} style={{ flexShrink: 0 }} alt="Remove item" />
    )}
  </TypeaheadResultContainer>
)

const SelectedTypeaheadValues = styled.ul`
  margin-top: 10px;
  list-style: none;
  padding: 0;
  display: flex;
  flex-flow: column nowrap;
  align-items: flex-start;
  gap: 5px;
`
const SelectedTypeaheadValue = styled.li`
  ${props => props.theme.smallParagraph};
  border-radius: 5px;
  background-color: #58b7b1;
  color: #101010;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  gap: 5px;
  padding-left: 10px;
`
const SelectedTypeaheadValueDeleteButton = styled.button`
  border: 0;
  background: transparent;
  cursor: pointer;
  padding: 0 7px;
  margin-left: 3px;
  height: 30px;
  border-bottom-right-radius: 5px;
  border-top-right-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  &:hover {
    background: rgba(0, 0, 0, 0.1);
  }
  &:active {
    outline: 1px solid ${({ theme }) => theme.mint};
  }
`

const FilterTypeahead = ({
  fieldLabel,
  values,
  options,
  updateFilter,
  filterIndex,
}: {
  fieldLabel: string
  values: FilterValues
  options: string[]
  updateFilter: (filterIndex: number, values: FilterValues) => void
  filterIndex: number
}) => {
  const selectedItems = values.map(value => ({
    key: value,
    label: value,
  }))
  const labelsOfSelectedItems = selectedItems.map(({ label }) => label)
  // Remove selected items from available options
  options = options.filter(option => !labelsOfSelectedItems.includes(option))

  const handleTypeaheadChange = (items: TypeaheadItem[]) => {
    updateFilter(
      filterIndex,
      items.map(({ label }) => label)
    )
  }
  const addItem = (itemToAdd: TypeaheadItem) => {
    const itemAlreadyAdded = selectedItems
      .map(({ key }) => key)
      .includes(itemToAdd.key)
    if (!itemAlreadyAdded) handleTypeaheadChange([...selectedItems, itemToAdd])
  }
  const removeItem = (itemToRemove: TypeaheadItem) => {
    const amendedItems = selectedItems.filter(
      ({ key }) => key !== itemToRemove.key
    )
    handleTypeaheadChange(amendedItems)
  }

  return (
    <>
      <InputLabel>
        <FieldName>{fieldLabel}</FieldName>
        <Typeahead
          multiselect={true}
          items={options.map(option => ({ key: option, label: option }))}
          values={selectedItems}
          onAdd={addItem}
          onRemove={removeItem}
          placeholder={`${selectedItems.length} selected`}
          backgroundColor="#000"
          fontColor="white"
          borderColor="white"
          RenderItem={({ item, selected }) => (
            <DarkTypeaheadResult {...{ item, selected }} />
          )}
          iconSVG="%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M6 9L12 15L18 9H6Z' fill='%23FFFFFF'/%3E%3C/svg%3E%0A"
        />
      </InputLabel>
      {values.length > 0 && (
        <SelectedTypeaheadValues>
          {values.map(value => (
            <SelectedTypeaheadValue key={value}>
              {value}
              <SelectedTypeaheadValueDeleteButton
                onClick={removeItem.bind(null, { key: value, label: value })}
              >
                <XIcon extraStyle="stroke: #101010" />
              </SelectedTypeaheadValueDeleteButton>
            </SelectedTypeaheadValue>
          ))}
        </SelectedTypeaheadValues>
      )}
    </>
  )
}
export default FilterTypeahead
