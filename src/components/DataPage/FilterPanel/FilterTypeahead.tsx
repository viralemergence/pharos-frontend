import React, { Dispatch, SetStateAction } from 'react'
import styled from 'styled-components'
import Typeahead, {
  Item as TypeaheadItem,
} from '../../../../library/ui/typeahead/Typeahead'
import FilterDarkTypeaheadResult from './FilterDarkTypeaheadResult'
import { XIcon, FieldName } from './DisplayComponents'
import { Filter } from 'pages/data'
import InputLabel from 'components/ui/InputLabel'
import colorPalette from 'figma/colorPalette'
import { UpdateFilterFunction } from './FilterPanel'
import { FilterDeleteButton } from './components'

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
  background-color: ${({ theme }) => theme.lightPurple};
  border-radius: 5px;
  color: ${({ theme }) => theme.black};
  display: flex;
  flex-flow: row nowrap;
  align-items: stretch;
  gap: 5px;
  padding-left: 5px;
`

const SelectedTypeaheadValueLabel = styled.div`
  padding: 5px;
`

const SelectedTypeaheadValueDeleteButton = styled.button`
  border: 0;
  background: transparent;
  cursor: pointer;
  padding: 0 7px;
  margin-left: 3px;
  flex: 1;
  border-bottom-right-radius: 5px;
  border-top-right-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  &:hover {
    background: ${({ theme }) => theme.veryLightPurple};
  }
  &:active {
    outline: 1px solid ${({ theme }) => theme.mint};
  }
`

const TypeaheadContainer = styled.div`
  display: flex;
  flex-flow: row nowrap;
  gap: 8px;
  & form {
    flex: 1;
    margin: 0;
    max-width: 400px !important;
  }
  & input[type='search'] {
    ${({ theme }) => theme.smallParagraph}
    &::placeholder {
      color: ${({ theme }) => theme.white} !important;
      opacity: 1 !important;
      font-weight: bold;
    }
    padding: 10px 15px 8px 15px !important;
    line-height: 25px !important;
  }

  // Make border under Typeahead input more opaque
  &:focus-within &:after {
    opacity: 1 !important;
  }
`

const TypeaheadLabel = styled(InputLabel)`
  ${({ theme }) => theme.smallParagraph}
  margin-bottom: 0 ! important;
  padding-bottom: 0;
  width: fit-content; // TODO: needed?
`

interface FilterTypeaheadProps {
  filter: Filter
  setFilters: Dispatch<SetStateAction<Filter[]>>
  updateFilter: UpdateFilterFunction
}

/** A typeahead component for setting the value of a filter */
const FilterTypeahead = ({
  filter,
  setFilters,
  updateFilter,
}: FilterTypeaheadProps) => {
  filter.values ??= []
  const values = filter.values.filter(value => value !== undefined) as string[]
  const selectedItems = values.map(value => ({
    key: value,
    label: value,
  }))
  const labelsOfSelectedItems = selectedItems.map(({ label }) => label)
  // Remove selected items from available options
  const options = filter.options.filter(
    option => !labelsOfSelectedItems.includes(option)
  )

  const handleTypeaheadChange = (items: TypeaheadItem[]) => {
    updateFilter(
      filter.fieldId,
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

  const typeaheadInputId = `typeahead-${filter.panelIndex}`

  return (
    <>
      <TypeaheadLabel htmlFor={typeaheadInputId}>
        <FieldName>{filter.label}</FieldName>
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
          backgroundColor={colorPalette.mutedPurple1}
          fontColor={colorPalette.white}
          borderColor={colorPalette.white}
          hoverColor={colorPalette.darkPurpleWhiter}
          selectedHoverColor={colorPalette.darkPurpleWhiter}
          RenderItem={({ item, selected }) => (
            <FilterDarkTypeaheadResult {...{ item, selected }} />
          )}
          iconSVG="%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M6 9L12 15L18 9H6Z' fill='%23FFFFFF'/%3E%3C/svg%3E%0A"
          resultsMaxHeight="300px"
          inputId={typeaheadInputId}
        />
        <FilterDeleteButton filter={filter} setFilters={setFilters} />
      </TypeaheadContainer>
      {values.length > 0 && (
        <SelectedTypeaheadValues>
          {values.map(value => (
            <SelectedTypeaheadValue key={value}>
              <SelectedTypeaheadValueLabel>
                {value}{' '}
              </SelectedTypeaheadValueLabel>
              <SelectedTypeaheadValueDeleteButton
                onClick={() => {
                  removeItem({ key: value, label: value })
                }}
                aria-label="Remove filter value"
              >
                <XIcon extraStyle={`stroke: ${colorPalette.black}`} />
              </SelectedTypeaheadValueDeleteButton>
            </SelectedTypeaheadValue>
          ))}
        </SelectedTypeaheadValues>
      )}
    </>
  )
}

export default FilterTypeahead
