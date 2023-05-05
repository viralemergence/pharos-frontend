import React, { memo, useRef, useState } from 'react'
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
  isOpen: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  setOptions: React.Dispatch<React.SetStateAction<TableViewOptions>>
}
const FilterDrawer = memo(
  ({ isOpen, setOpen, setOptions }: FilterDrawerProps) => {
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

    const DrawerToggle = ({ onClick }) => {
      const Button = styled.button`
        position: absolute;
        top: 28px;
        right: ${isOpen ? '-17px' : '-50px'};
        width: 34px;
        height: 44px;
        background: rgba(29, 28, 28, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 5px;
        cursor: pointer;
        border: ${isOpen ? '0' : '1px solid #fff'};
        ${!isOpen && 'transform: scaleX(-1);'};
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

    const Drawer = isOpen
      ? styled.div`
          background-color: rgba(51, 51, 51, 0.5);
          color: #fff;
          padding: 34px 40px;
          position: relative;
          z-index: 2;
        `
      : styled.div`
          background-color: transparent;
          position: relative;
          z-index: 2;
        `

    return (
      <Drawer>
        <DrawerToggle
          onClick={() => {
            setOpen((open: boolean) => !open)
          }}
        />
        {isOpen && (
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
