import React, { memo, useState } from 'react'
import styled from 'styled-components'
import InputLabel from '../../ui/InputLabel'
import type { FilterData } from './TableView'
import FilterDrawerToggleButton from './FilterDrawerToggleButton'
import FilterInput from './FilterInput'

const DrawerHeader = styled.div`
  ${({ theme }) => theme.bigParagraph};
`

const DrawerContainer = styled.div<{ isFilterDrawerOpen: boolean }>`
  background-color: ${props =>
    props.isFilterDrawerOpen ? 'rgba(33, 33, 33, 0.7)' : 'transparent'};
  color: ${({ theme }) => theme.white};
  padding: ${props => (props.isFilterDrawerOpen ? '34px 40px' : '0')};
  position: relative;
  z-index: 2;
`

const FilterDrawer = memo(
  ({
    filterData,
    filterOnInputHandler,
  }: {
    filterData: FilterData
    filterOnInputHandler: (e: React.ChangeEvent<HTMLInputElement>) => void
  }) => {
    const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(true)

    return (
      <DrawerContainer isFilterDrawerOpen={isFilterDrawerOpen}>
        <FilterDrawerToggleButton
          onClick={() => {
            setIsFilterDrawerOpen(open => !open)
          }}
          isFilterDrawerOpen={isFilterDrawerOpen}
        />
        {isFilterDrawerOpen && (
          <>
            <DrawerHeader>Filters</DrawerHeader>
            {Array.from(filterData).map(
              ([filterId, { description, value }]) => (
                <div key={filterId} style={{ marginTop: '20px' }}>
                  <InputLabel>
                    <div style={{ marginBottom: '5px' }}>
                      Search by {description}
                    </div>
                    <FilterInput
                      id={`filter-${filterId}`}
                      onInput={filterOnInputHandler}
                      defaultValue={value}
                    />
                  </InputLabel>
                </div>
              )
            )}
          </>
        )}
      </DrawerContainer>
    )
  }
)

export default FilterDrawer
