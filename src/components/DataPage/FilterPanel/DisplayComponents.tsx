import React from 'react'
import styled from 'styled-components'

const XIconSvg = styled.svg<{ extraStyle?: string }>`
  ${({ extraStyle }) => extraStyle}
`

export const XIcon = ({ extraStyle = '' }: { extraStyle?: string }) => (
  <XIconSvg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#fff"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    extraStyle={extraStyle}
  >
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </XIconSvg>
)

const BackIconSvg = styled.svg`
  display: block;
  fill: none;
  height: 24px;
  width: 24px;
  stroke: #fff;
  stroke-width: 1.6;
  overflow: visible;
`

export const BackIcon = () => (
  <BackIconSvg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    aria-hidden="true"
    role="presentation"
    focusable="false"
  >
    <path fill="none" d="M20 28 8.7 16.7a1 1 0 0 1 0-1.4L20 4"></path>
  </BackIconSvg>
)

export const PlusIcon = ({ style = {} }: { style?: React.CSSProperties }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 20 18"
    style={style}
  >
    <line x1="12" y1="5" x2="12" y2="19" stroke="white" strokeWidth="2" />
    <line x1="5" y1="12" x2="19" y2="12" stroke="white" strokeWidth="2" />
  </svg>
)

export const FieldName = styled.div`
  margin-bottom: 5px;
`

export const FilterPanelToolbarNav = styled.nav`
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  padding-bottom: 20px;
  padding: 14px 30px;
  gap: 10px;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 1px 30px 0px;
  @media (max-width: ${({ theme }) => theme.breakpoints.tabletMaxWidth}) {
    justify-content: flex-start;
    padding: 10px 20px;
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.mobileMaxWidth}) {
    gap: 5px;
  }
`

export const FilterAdderMessage = styled.div`
  ${props => props.theme.smallParagraph};
  padding: 10px 15px;
  color: ${({ theme }) => theme.white};
`

export const FilterPanelButton = styled.button`
  ${props => props.theme.smallParagraph};
  padding: 10px 15px;
  text-align: left;
  background-color: transparent;
  color: ${({ theme }) => theme.white};
  border: 0;
  cursor: pointer;
  &:hover {
    background-color: ${({ theme }) => theme.white20PercentOpacity};
  }
`

export const FilterPanelToolbarButtonStyled = styled(FilterPanelButton)<{
  isFilterAdderOpen?: boolean
}>`
  border-radius: 5px;
  ${({ isFilterAdderOpen }) =>
    !isFilterAdderOpen
      ? 'border-bottom-left-radius: 5px; border-bottom-right-radius: 5px;'
      : ''}
  background-color: ${({ isFilterAdderOpen, theme }) =>
    isFilterAdderOpen ? theme.white20PercentOpacity : 'transparent'};
  &:active {
    outline: 2px solid ${({ theme }) => theme.darkGray};
  }
`

export const FilterPanelCloseButton = styled(FilterPanelToolbarButtonStyled)`
  @media (min-width: ${({ theme }) => theme.breakpoints.laptopMinWidth}) {
    position: absolute;
    right: 2px;
    top: 2px;
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.tabletMaxWidth}) {
  }
  border-radius: 50%;
  background: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px;
  &:hover {
    background: inherit;
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.tabletMaxWidth}) {
    width: 45px;
  }
`

export const FilterAdderDiv = styled.div`
  position: absolute;
  width: 348px;
  top: 15px;
  display: flex;
  flex-flow: column nowrap;
  align-items: flex-start;
  background-color: ${({ theme }) => theme.medBlack};
  border-radius: 5px;
  padding: 5px 0;
  @media (max-width: ${({ theme }) => theme.breakpoints.tabletMaxWidth}) {
    top: 11px;
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.mobileMaxWidth}) {
    width: 250px;
  }
`

export const AddFilterToPanelButtonStyled = styled(FilterPanelButton)<{
  disabled?: boolean
}>`
  width: 100%;
  padding: 5px 15px;
  margin-bottom: 5px;
  ${({ disabled, theme }) =>
    disabled
      ? `color: ${theme.veryDarkGray};
        cursor: unset;
        &:hover { background-color: inherit; }`
      : `
        &:hover {
          background-color: ${theme.medGray};
          color: ${theme.medBlack};
        }
        &:active { 
          outline: 1px solid ${theme.mint};
        }
    `}
`

export const FilterPanelCloseButtonWithBackIcon = styled(
  FilterPanelCloseButton
)`
  display: none;
  @media (max-width: ${({ theme }) => theme.breakpoints.tabletMaxWidth}) {
    display: flex;
  }
`

export const FilterPanelCloseButtonWithXIcon = styled(FilterPanelCloseButton)`
  @media (max-width: ${({ theme }) => theme.breakpoints.tabletMaxWidth}) {
    margin-left: auto;
    margin-right: 0;
  }
`

export const FilterListItemElement = styled.li<{ opacity: number }>`
  list-style: none;
  margin-bottom: 20px;
  opacity: ${({ opacity }) => opacity};
  transition: opacity 0.25s;
  &:last-child {
    margin-bottom: 0;
  }
`

export const ListOfAddedFilters = styled.ul`
  position: absolute;
  margin: 0;
  bottom: 0;
  right: 0;
  left: 0;
  overflow-y: auto;
  padding: 34px 40px;
  flex-grow: 1;
  flex-shrink: 1;
  max-height: 100%;
  top: 73px;
  @media (max-width: ${({ theme }) => theme.breakpoints.tabletMaxWidth}) {
    top: 64px;
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.mobileMaxWidth}) {
    padding: 34px 20px;
  }
`

export const FilterLabel = styled.label`
  ${({ theme }) => theme.smallParagraph}
  display: block;
`

const panelWidth = '410px'

export const Panel = styled.aside<{ open: boolean }>`
  pointer-events: auto;
  position: relative;
  backdrop-filter: blur(47px);
  background-color: ${({ theme }) => theme.white10PercentOpacity};
  border: 1px solid ${({ theme }) => theme.white10PercentOpacity};
  color: ${({ theme }) => theme.white};
  display: flex;
  height: 100%;
  max-height: 100%;
  flex-flow: column nowrap;
  margin-left: ${({ open }) => (open ? '30px' : `-${panelWidth}`)};
  width: min(${panelWidth}, 100%);
  max-width: ${panelWidth};
  transition: margin-left 300ms cubic-bezier(0.4, 0, 0.2, 1);
  @media (max-width: ${({ theme }) => theme.breakpoints.tabletMaxWidth}) {
    transition: none;
    backdrop-filter: blur(100px);
    border-radius: 0;
    border: 0;
    display: ${({ open }) => (open ? 'flex' : 'none')};
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: 0;
    height: 100%;
    margin-right: 0;
    position: absolute;
    width: 100vw;
    max-width: unset;
  }
`

export const FieldInput = styled.input`
  ${({ theme }) => theme.smallParagraph};
  background-color: #202020;
  border-radius: 5px;
  border: 1px solid ${({ theme }) => theme.white};
  color: ${({ theme }) => theme.white};
  font-weight: 600;
  padding: 8px 10px;
  &:invalid {
    border-color: ${({ theme }) => theme.red};
  }

  // TODO: Use this to dim Safari dark mode placeholder better
  // &.blank::-webkit-datetime-edit {
  //   &-day-field,
  //   &-month-field,
  //   &-year-field {
  //     opacity: 0.3;
  //   }
  // }
`

export const DataToolbarButton = styled.button<{
  selected?: boolean
  width?: number
}>`
  ${({ theme }) => theme.bigParagraph};
  position: relative;
  font-size: 16px;
  line-height: 25px;
  background: none;
  border: 0;
  background-color: ${({ selected, theme }) =>
    selected ? theme.mint : 'transparent'};
  ${({ selected, theme }) =>
    selected
      ? ''
      : `
      &:hover { background-color: ${theme.white10PercentOpacity}; }
      `}
  color: ${({ selected, theme }) => (selected ? theme.black : theme.white)};
  border-radius: 7px;
  cursor: pointer;
  &:last-child {
    margin-right: 0;
  }
  width: ${({ width }) => (width ? width + 'px' : 'auto')};
  height: 100%;
  padding: 5px 10px;
  &:active {
    outline: 2px solid ${({ theme }) => theme.white20PercentOpacity};
  }
`

export const FilterPanelLauncher = styled(DataToolbarButton)`
  padding-left: 10px;
  padding-right: 10px;
  margin-left: 0;
  border-radius: 9px;
`

export const DataToolbarRadioButton = styled(DataToolbarButton)``

export const DataToolbarButtonContainer = styled.div`
  background-color: ${({ theme }) => theme.white20PercentOpacity};
  border-radius: 10px;
  position: relative;
  display: flex;
  flex-flow: row nowrap;
  gap: 10px;
  backdrop-filter: blur(3px);
  border: 1px solid ${({ theme }) => theme.white10PercentOpacity};
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.124);
`

export const ContainerForRadioButtons = styled(DataToolbarButtonContainer)`
  padding: 5px;
`

export const ContainerForFilterPanelLauncher = styled(
  DataToolbarButtonContainer
)`
  height: 42px;
`

export const DataToolbarDiv = styled.div<{ isFilterPanelOpen: boolean }>`
  padding: 20px 0 0 30px;
  display: flex;
  flex-flow: row wrap;
  gap: 10px;
  flex-basis: 60px;
  align-items: center;
  @media (max-width: ${({ theme }) => theme.breakpoints.tabletMaxWidth}) {
    padding: 10px;
    ${({ isFilterPanelOpen }) => (isFilterPanelOpen ? 'display: none' : '')}
  }
`