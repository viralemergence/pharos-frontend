import React, { useRef } from 'react'
import styled from 'styled-components'
import SearchIcon from './SearchIcon'
import Input from '../../ui/Input'
import InputLabel from '../../ui/InputLabel'

// After the user types in a filter input, wait this many milliseconds before filtering.
const filterWait = 3000

// TODO: Fix, should be 432px, with the textfields 350px wide. I don't
// understand why it needs to be set so wide to achieve that textfield width.
const drawerWidth = '750'

const FilterDrawerDiv = styled.div`
  padding: 34px 40px;
  width: ${drawerWidth}px;
  flex: 1;
  background-color: rgba(51, 51, 51, 0.5);
  color: #fff;
`
const DrawerHeader = styled.div`
  ${({ theme }) => theme.bigParagraph};
`
const FilterContainer = styled.div`
  margin-top: 20px;
`
const FilterInput = styled(Input)`
  background-color: transparent;
  border-color: #fff;
  font-size: 14px;
  font-family: Open Sans;
  padding-right: 36px;
  padding-left: 10px;
  margin-top: 0px;
  color: #fff;
`

type FilterNameAndChildren = {
  name: string
  children: React.ReactNode | null
}
const FilterInputLabel = ({ name, children }: FilterNameAndChildren) => (
  <InputLabel htmlFor={`filter-by-${name}`} style={{ marginBottom: '5px' }}>
    {children}
  </InputLabel>
)

type FilterDrawerProps = {
  loadPublishedRecords: (
    page: number,
    extraSearchParams: Record<string, string>
  ) => void
}
const FilterDrawer = () => {
  const loadPublishedRecords = () => null;
  type TimeoutsType = Record<string, ReturnType<typeof setTimeout>>
  const timeoutsForFilterInputs = useRef<TimeoutsType>({} as TimeoutsType)

  const handleFilterInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    filterName: string
  ) => {
    clearTimeout(timeoutsForFilterInputs.current[filterName])
    timeoutsForFilterInputs.current[filterName] = setTimeout(() => {
      loadPublishedRecords(1, { [filterName]: e.target.value })
    }, filterWait)
  }

  const FilterInputWithIcon = ({ name }) => (
    <div style={{ position: 'relative' }}>
      <FilterInput
        id={`filter-by-${name}`}
        onInput={(e: React.ChangeEvent<HTMLInputElement>) =>
          handleFilterInput(e, name)
        }
      />
      <SearchIcon />
    </div>
  )

  return (
    <FilterDrawerDiv>
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
    </FilterDrawerDiv>
  )
}
export default FilterDrawer
