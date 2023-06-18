import React from 'react'
import styled from 'styled-components'
import Typeahead, {
  Item as TypeaheadItem,
} from '../../../../library/ui/typeahead/Typeahead'
import FilterDarkTypeaheadResult from './FilterDarkTypeaheadResult'
import { XIcon, FieldName, FilterValues } from './constants'
import InputLabel from '../../ui/InputLabel'

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

const TypeaheadContainer = styled.div`
  & form {
    max-width: 400px !important;
    margin-bottom: 10px;
  }
  & input[type='search'] {
    ${({ theme }) => theme.smallParagraph}
    &::placeholder {
      color: #fff !important;
      opacity: 1 !important;
      font-weight: bold;
    }
    padding: 10px 15px 8px 15px !important;
    line-height: 25px !important;
  }
`
const TypeaheadLabel = styled(InputLabel)`
  ${({ theme }) => theme.smallParagraph}
  margin-bottom: 10px;
  width: fit-content;
`

interface FilterTypeaheadProps {
  fieldLabel: string
  values: FilterValues
  options: string[]
  updateFilter: (filterIndex: number, values: FilterValues) => void
  filterIndex: number
}

/** A typeahead component for setting the value of a filter */
const FilterTypeahead = ({
  fieldLabel,
  values,
  options,
  updateFilter,
  filterIndex,
}: FilterTypeaheadProps) => {
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

  const typeaheadInputId = `typeahead-${filterIndex}`

  return (
    <>
      <TypeaheadLabel htmlFor={typeaheadInputId}>
        <FieldName>{fieldLabel}</FieldName>
      </TypeaheadLabel>
      <TypeaheadContainer>
        <Typeahead
          multiselect={true}
          items={options.map(option => ({ key: option, label: option }))}
          values={selectedItems}
          onAdd={addItem}
          onRemove={removeItem}
          placeholder={
            selectedItems.length ? `${selectedItems.length} selected` : ''
          }
          backgroundColor="#000"
          fontColor="white"
          borderColor="#fff"
          selectedHoverColor="#594141"
          hoverColor="#49515d"
          RenderItem={({ item, selected }) => (
            <FilterDarkTypeaheadResult {...{ item, selected }} />
          )}
          iconSVG="%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M6 9L12 15L18 9H6Z' fill='%23FFFFFF'/%3E%3C/svg%3E%0A"
          resultsMaxHeight="300px"
          inputId={typeaheadInputId}
        />
      </TypeaheadContainer>
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
