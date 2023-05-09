import React, { memo, useState, useRef } from 'react'
import styled from 'styled-components'
import type { TableViewOptions } from './TableView'
import FilterDrawerToggleButton from './FilterDrawerToggleButton'
import { FilterInputLabel, FilterInput } from './FilterInput'

export type FilterInputEventHandler = (
  e: React.ChangeEvent<HTMLInputElement>,
  filterName: string
) => void

const DrawerHeader = styled.div`
  ${({ theme }) => theme.bigParagraph};
`

const FilterContainer = ({
  name,
  text,
  handleFilterInput,
}: {
  name: string
  text: string
  handleFilterInput: FilterInputEventHandler
}) => {
  return (
    <div style={{ marginTop: '20px' }}>
      <FilterInputLabel name={name}>Search by {text}</FilterInputLabel>
      <FilterInput name={name} handleFilterInput={handleFilterInput} />
    </div>
  )
}

const DrawerContainer = styled.div<{ isFilterDrawerOpen: boolean }>`
  background-color: ${props =>
    props.isFilterDrawerOpen ? 'rgba(33, 33, 33, 0.7)' : 'transparent'};
  color: ${({ theme }) => theme.white};
  padding: ${props => (props.isFilterDrawerOpen ? '34px 40px' : '0')};
  position: relative;
  z-index: 2;
`

type FilterDrawerProps = {
  setOptions: React.Dispatch<React.SetStateAction<TableViewOptions>>
}
const FilterDrawer = memo(({ setOptions }: FilterDrawerProps) => {
  type TimeoutsType = Record<string, ReturnType<typeof setTimeout>>
  const timeoutsForFilterInputs = useRef<TimeoutsType>({} as TimeoutsType)

  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState<boolean>(false)

  const handleFilterInput: FilterInputEventHandler = (e, filterName) => {
    clearTimeout(timeoutsForFilterInputs.current[filterName])
    timeoutsForFilterInputs.current[filterName] = setTimeout(() => {
      setOptions((options: TableViewOptions) => {
        return {
          ...options,
          appendResults: false,
          filters: {
            ...options?.filters,
            [filterName]: e.target.value,
          },
        }
      })
    }, 500)
  }

  const filters = {
    hostSpecies: 'host species',
    pathogen: 'pathogen',
    detectionTarget: 'detection target',
  }

  return (
    <DrawerContainer isFilterDrawerOpen={isFilterDrawerOpen}>
      <FilterDrawerToggleButton
        onClick={() => {
          setIsFilterDrawerOpen((open: boolean) => !open)
        }}
        isFilterDrawerOpen={isFilterDrawerOpen}
      />
      {isFilterDrawerOpen && (
        <>
          <DrawerHeader>Filters</DrawerHeader>
          {Object.entries(filters).map(([name, text]) => (
            <FilterContainer
              name={name}
              text={text}
              handleFilterInput={handleFilterInput}
            />
          ))}
        </>
      )}
    </DrawerContainer>
  )
})

export default FilterDrawer
