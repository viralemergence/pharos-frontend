import React, { memo, useRef } from 'react'
import styled from 'styled-components'
import SearchIcon from './SearchIcon'
import InputLabel from '../../ui/InputLabel'
import type { TableViewOptions } from './TableView'

const DrawerHeader = styled.div`
  ${({ theme }) => theme.bigParagraph};
`
const FilterContainer = styled.div`
  margin-top: 20px;
`
const FilterInputElement = styled.input`
  border: 1px solid #fff;
  border-radius: 5px;
  background-color: transparent;
  border-color: #fff;
  color: #fff;
  font-size: 14px;
  font-family: Open Sans;
  margin-top: 0px;
  padding: 10px 36px 10px 10px;
  width: 350px;
  z-index: 1;
  position: relative;
`
const FilterInput = props => <FilterInputElement {...props} />

type FilterNameAndChildren = {
  name: string
  children: React.ReactNode
}
const FilterInputLabel = ({ name, children }: FilterNameAndChildren) => (
  <InputLabel htmlFor={`filter-by-${name}`} style={{ marginBottom: '5px' }}>
    {children}
  </InputLabel>
)

type FilterDrawerProps = {
  setOptions: React.Dispatch<React.SetStateAction<TableViewOptions>>
}
const FilterDrawer = memo(({ setOptions }: FilterDrawerProps) => {
  type TimeoutsType = Record<string, ReturnType<typeof setTimeout>>
  const timeoutsForFilterInputs = useRef<TimeoutsType>({} as TimeoutsType)

  const handleFilterInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    filterName: string
  ) => {
    clearTimeout(timeoutsForFilterInputs.current[filterName])
    timeoutsForFilterInputs.current[filterName] = setTimeout(() => {
      setOptions((options: TableViewOptions) => {
        return {
          ...options,
          append: false,
          extraSearchParams: {
            ...options?.extraSearchParams,
            [filterName]: e.target.value,
          },
        }
      })
    }, 500)
  }

  const FilterInputWithIcon = ({ name }: { name: string }) => {
    return (
      <div style={{ position: 'relative', width: 350 }}>
        <FilterInput
          id={`filter-by-${name}`}
          onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
            handleFilterInput(e, name)
          }}
        />
        <SearchIcon />
      </div>
    )
  }

  const Div = styled.div`
    background-color: rgba(33, 33, 33, .5);
    backdrop-filter: 100px;
    color: #fff;
    padding: 34px 40px;
  `

  return (
    <Div>
      <DrawerHeader>Filters</DrawerHeader>

      <FilterContainer>
        <FilterInputLabel name="hostSpecies">
          Search by host species
        </FilterInputLabel>
        <FilterInputWithIcon name="hostSpecies" />
      </FilterContainer>

      <FilterContainer>
        <FilterInputLabel name="pathogen">Search by pathogen</FilterInputLabel>
        <FilterInputWithIcon name="pathogen" />
      </FilterContainer>

      <FilterContainer>
        <FilterInputLabel name="detectionTarget">
          Search by detection target
        </FilterInputLabel>
        <FilterInputWithIcon name="detectionTarget" />
      </FilterContainer>
    </Div>
  )
})
export default FilterDrawer
