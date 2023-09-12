import React from 'react'
import { Link } from 'gatsby'
import styled, { css } from 'styled-components'

import Dropdown from '@talus-analytics/library.ui.dropdown'
import ThreeDotsIcon from './MintToolbarIcons/ThreeDotsIcon'

const MintToolbar = styled.div`
  display: flex;
  align-items: center;
  padding: 5px;
  gap: 10px;
  border-radius: 5px;
  background: ${({ theme }) => theme.lightMint};
`

const MintToolbarButtonStyle = css<{ tooltip: string }>`
  position: relative;
  border: none;
  background: none;
  margin: 0;
  padding: 7px;
  border-radius: 5px;
  transition: 150ms ease;
  background: ${({ theme }) => theme.lightMint};
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${({ theme }) => theme.hoverMint2};
    transition: 250ms ease;

    &:before {
      ${({ theme }) => theme.extraSmallParagraph};
      content: '${({ tooltip }) => tooltip}';
      position: absolute;
      top: -5px;
      left: 50%;
      padding: 3px 10px;
      transform: translate(-50%, -100%);
      background-color: ${({ theme }) => theme.black};
      color: ${({ theme }) => theme.white};
      display: flex;
      align-items: center;
      justify-content: center;
      width: max-content;
    }
  }
`

export const MintToolbarButton = styled.button<{ tooltip: string }>`
  ${MintToolbarButtonStyle}
`

export const MintToolbarButtonLink = styled(Link)<{ tooltip: string }>`
  ${MintToolbarButtonStyle}
`

const ToolbarThreeDotsButton = styled(MintToolbarButton)<{ tooltip: string }>`
  margin-top: 3px;
  margin-bottom: 3px;
  aspect-ratio: 1 / 1;
  padding: 7px 10px;

  &:hover {
    &:before {
      top: -2px;
    }
  }
`

const ToolbarMoreMenu = styled.div`
  background-color: ${({ theme }) => theme.black};
  border-radius: 5px;
  padding: 5px 0px;
  display: flex;
  flex-direction: column;
  justify-content: stretch;
`

export const MintToolbarMoreMenuButton = styled.button`
  background: none;
  border: none;
  ${({ theme }) => theme.smallParagraph};
  color: ${({ theme }) => theme.white};
  background-color: ${({ theme }) => theme.black};
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 5px 20px;

  &:hover {
    background-color: ${({ theme }) => theme.lightBlack};
  }
`

interface MintToolbarMoreProps {
  children: React.ReactNode
}

export const MintToolbarMore = ({ children }: MintToolbarMoreProps) => {
  return (
    <Dropdown
      expanderStyle={{ left: 'unset', right: '0px' }}
      renderButton={() => (
        <ToolbarThreeDotsButton tooltip="More">
          <ThreeDotsIcon />
        </ToolbarThreeDotsButton>
      )}
    >
      <ToolbarMoreMenu>{children}</ToolbarMoreMenu>
    </Dropdown>
  )
}

export default MintToolbar
