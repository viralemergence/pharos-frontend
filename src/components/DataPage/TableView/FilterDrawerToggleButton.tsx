import React from 'react'
import styled from 'styled-components'

type FilterDrawerToggleButtonProps = {
  onClick: React.MouseEventHandler<HTMLButtonElement>
  isFilterDrawerOpen: boolean
}
const Button = styled.button`
  position: absolute;
  top: 28px;
  right: ${(props: FilterDrawerToggleButtonProps) =>
    props.isFilterDrawerOpen ? '-17px' : '-34px'};
  width: 34px;
  height: 44px;
  background: rgba(29, 29, 29, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: ${(props: FilterDrawerToggleButtonProps) =>
    props.isFilterDrawerOpen ? '5px' : '5px 0 0 5px'};
  cursor: pointer;
  border: 0;
  ${
    // flip horizontally when drawer is closed
    (props: FilterDrawerToggleButtonProps) =>
      !props.isFilterDrawerOpen && 'transform: scaleX(-1);'
  };
`

const FilterDrawerToggleButton = ({
  onClick,
  isFilterDrawerOpen,
}: FilterDrawerToggleButtonProps) => {
  return (
    <Button onClick={onClick} isFilterDrawerOpen={isFilterDrawerOpen}>
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M5 14H9.5L4.5 7L9.5 -1.90735e-06H5L-9.53674e-07 7L5 14Z"
          fill="white"
        />
        <path d="M11 14H15.5L10.5 7L15.5 0H11L6.5 7L11 14Z" fill="white" />
      </svg>
    </Button>
  )
}

export default FilterDrawerToggleButton
