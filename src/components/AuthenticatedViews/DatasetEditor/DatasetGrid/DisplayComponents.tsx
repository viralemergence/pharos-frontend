import React from 'react'
import styled from 'styled-components'

export const CellContainer = styled.div`
  margin-left: -8px;
  margin-right: -8px;
  max-width: calc(100% + 16px);
  padding: 0 8px;
  display: flex;
  justify-content: space-between;

  &:hover > button {
    right: 6px;
    background-color: ${({ theme }) => theme.lightGray};
    border: 1px solid ${({ theme }) => theme.medGray};
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.025);
  }

  > div {
    padding-right: 8px;
    transition: 250ms ease;
  }
  &:hover > div {
    padding-right: 25px;
  }
`

const ExpandButtonStyle = styled.button`
  display: block;
  position: absolute;
  right: -15px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: 1px solid rgba(0, 0, 0, 0);
  padding: 4px;
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 250ms ease;

  path {
    transition: 250ms ease;
    fill: ${({ theme }) => theme.darkGray};
  }

  &:hover {
    background-color: ${({ theme }) => theme.medGray} !important;

    path {
      fill: ${({ theme }) => theme.black};
    }
  }
`

const ExpandButtonIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
    <g clipPath="url(#clip0_56_135)">
      <path d="M20 13.6H13.6V20H10.4V13.6H4V10.4H10.4V4H13.6V10.4H20V13.6Z" />
    </g>
    <defs>
      <clipPath id="clip0_56_135">
        <rect width="24" height="24" fill="white" />
      </clipPath>
    </defs>
  </svg>
)

export const ExpandButton = ({
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <ExpandButtonStyle {...props}>
    <ExpandButtonIcon />
  </ExpandButtonStyle>
)
