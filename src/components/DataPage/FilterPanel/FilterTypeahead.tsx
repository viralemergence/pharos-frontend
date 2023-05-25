import React from 'react'
import styled from 'styled-components'
import Typeahead, {
  Item as TypeaheadItem,
} from '@talus-analytics/library.ui.typeahead'
import { FilterValues } from './constants'
import { XIcon } from './constants'

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
  padding: 0 10px 0 7px;
  margin-left: 3px;
  height: 30px;
  border-bottom-right-radius: 5px;
  border-top-right-radius: 5px;
  &:hover {
    background: rgba(0, 0, 0, 0.1);
  }
  &:active {
    outline: 1px solid ${({ theme }) => theme.mint};
  }
`

const FilterTypeahead = ({
  values,
  options,
  handleTypeaheadChange,
}: {
  values: FilterValues
  options: string[]
  handleTypeaheadChange: (items: TypeaheadItem[]) => void
}) => {
  console.log(Date.now(), 'values in FilterTypehead', values.length, values)
  const selectedItems = values.map(value => ({
    key: value,
    label: value,
  }))
  const labelsOfSelectedItems = selectedItems.map(({ label }) => label)
  // Remove selected items from available options
  options = options.filter(option => !labelsOfSelectedItems.includes(option))
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
      />
      {values.length > 0 && (
        <SelectedTypeaheadValues>
          {values.map(value => (
            <SelectedTypeaheadValue key={value}>
              {value}
              <SelectedTypeaheadValueDeleteButton
                onClick={() => {
                  removeItem({ key: value, label: value })
                }}
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
