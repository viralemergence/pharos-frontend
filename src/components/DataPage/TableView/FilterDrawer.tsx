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

const FilterInputLabel = ({
  name,
  children,
}: {
  name: string
  children: React.ReactNode
}) => (
  <InputLabel htmlFor={`filter-by-${name}`} style={{ marginBottom: '5px' }}>
    {children}
  </InputLabel>
)

type FilterDrawerProps = {
  setOptions: React.Dispatch<React.SetStateAction<TableViewOptions>>
  isDrawerOpen: boolean;
  setIsDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>
}
const FilterDrawer = memo(({ isDrawerOpen, setIsDrawerOpen, setOptions }: FilterDrawerProps) => {
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
          appendResults: false,
          filters: {
            ...options?.filters,
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

    const DrawerToggleButton = ({ onClick }) => {
      const Button = styled.button`
        position: absolute;
        top: 28px;
        right: ${isDrawerOpen ? '-17px' : '-50px'};
        width: 34px;
        height: 44px;
        background: rgba(29, 28, 28, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 5px;
        cursor: pointer;
        border: ${isDrawerOpen ? '0' : '1px solid #fff'};
        ${!isDrawerOpen && 'transform: scaleX(-1);'};
      `
      return (
        <Button onClick={onClick}>
          <svg
            width="20"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5 14H9.5L4.5 7L9.5 -1.90735e-06H5L-9.53674e-07 7L5 14Z"
              fill="white"
            />
            <path d="M10 14H14.5L9.5 7L14.5 0H10L5.5 7L10 14Z" fill="white" />
          </svg>
        </Button>
      )
    }

    const Drawer = styled.div`
      background-color: ${isDrawerOpen ? "rgba(33, 33, 33, 0.5)": "transparent"};
      color: #fff;
      padding: ${isDrawerOpen? "34px 40px" : "0"};
      position: relative;
      z-index: 2;
    `

    return (
      <Drawer>
        <DrawerToggleButton
          onClick={() => {
            setIsDrawerOpen((open: boolean) => !open)
          }}
        />
        {isDrawerOpen && (
          <content>
            <DrawerHeader>Filters</DrawerHeader>

            <FilterContainer>
              <FilterInputLabel name="hostSpecies">
                Search by host species
              </FilterInputLabel>
              <FilterInputWithIcon name="hostSpecies" />
            </FilterContainer>

            <FilterContainer>
              <FilterInputLabel name="pathogen">
                Search by pathogen
              </FilterInputLabel>
              <FilterInputWithIcon name="pathogen" />
            </FilterContainer>

            <FilterContainer>
              <FilterInputLabel name="detectionTarget">
                Search by detection target
              </FilterInputLabel>
              <FilterInputWithIcon name="detectionTarget" />
            </FilterContainer>
          </content>
        )}
      </Drawer>
    )
  }
)
export default FilterDrawer

