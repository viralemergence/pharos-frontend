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

export const FieldSelectorMessage = styled.div`
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

export const FilterPanelToolbarButton = styled(FilterPanelButton)<{
  isFieldSelectorOpen?: boolean
}>`
  border-radius: 5px;
  ${({ isFieldSelectorOpen }) =>
    !isFieldSelectorOpen
      ? 'border-bottom-left-radius: 5px; border-bottom-right-radius: 5px;'
      : ''}
  background-color: ${({ isFieldSelectorOpen, theme }) =>
    isFieldSelectorOpen ? theme.white20PercentOpacity : 'transparent'};
  &:active {
    outline: 2px solid ${({ theme }) => theme.darkGray};
  }
`

export const FilterPanelCloseButton = styled(FilterPanelToolbarButton)`
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

export const FieldSelectorDiv = styled.div`
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

export const FieldSelectorButton = styled(FilterPanelButton)<{
  disabled: boolean
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

export const ScreenReaderOnly = styled.div`
  clip-path: inset(50%);
  clip: rect(0 0 0 0);
  height: 0px;
  overflow: hidden;
  position: absolute;
  width: 0px;
`
