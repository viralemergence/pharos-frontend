import React from 'react'
import colorPalette from 'figma/colorPalette'
import styled from 'styled-components'

export enum SortStatus {
  selected,
  reverse,
  unselected,
}

interface SortIconProps extends React.SVGProps<SVGSVGElement> {
  status: SortStatus
  upArrowSelectedColor?: string
  downArrowSelectedColor?: string
  upArrowUnselectedColor?: string
  downArrowUnselectedColor?: string
}

const SortIconSVGStyled = styled.svg`
  width: 19px;
  height: 19px;
  align-self: center;
  flex-shrink: 0;
`

const SortIcon = ({
  status,
  upArrowSelectedColor = colorPalette.black,
  downArrowSelectedColor = colorPalette.black,
  upArrowUnselectedColor = colorPalette.medGray,
  downArrowUnselectedColor = colorPalette.medGray,
}: SortIconProps) => {
  const transparent = 'rgba(0, 0, 0, 0)'

  let upArrowFill: string, downArrowFill: string

  switch (status) {
    case SortStatus.selected:
      console.log('selected')
      upArrowFill = transparent
      downArrowFill = downArrowSelectedColor
      break
    case SortStatus.reverse:
      console.log('reverse')
      upArrowFill = upArrowSelectedColor
      downArrowFill = transparent
      break
    case SortStatus.unselected:
      upArrowFill = upArrowUnselectedColor
      downArrowFill = downArrowUnselectedColor
      break
  }

  return (
    <SortIconSVGStyled
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_1831_13593)">
        <path
          d="M14.1667 8.33337L10.0001 4.16671L5.83341 8.33337L14.1667 8.33337Z"
          fill={upArrowFill}
        />
        <path
          d="M5.83325 11.6666L9.99992 15.8333L14.1666 11.6666H5.83325Z"
          fill={downArrowFill}
        />
      </g>
      <defs>
        <clipPath id="clip0_1831_13593">
          <rect width="20" height="20" fill="white" />
        </clipPath>
      </defs>
    </SortIconSVGStyled>
  )
}

export default SortIcon
