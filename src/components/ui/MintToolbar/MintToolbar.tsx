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
      // top: -7px;
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

  &:disabled {
    opacity: 0.5;
  }
`

export const MintToolbarButtonLink = styled(Link)<{ tooltip: string }>`
  ${MintToolbarButtonStyle}
`

const ToolbarMoreContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`

const ToolbarThreeDotsButton = styled.button<{ tooltip: string }>`
  position: relative;
  padding: 0px;
  background: none;
  border: none;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`

const ToolbarThreeDotsVisibleButton = styled.div<{ tooltip: string }>`
  aspect-ratio: 1 / 1;
  position: relative;
  margin: 0;
  padding: 9px;
  border-radius: 5px;
  transition: 150ms ease;
  background: ${({ theme }) => theme.lightMint};
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${({ theme }) => theme.hoverMint2};
    transition: 250ms ease;
  }
`

const ToolbarMoreMenu = styled.div`
  background-color: ${({ theme }) => theme.black};
  border-radius: 5px;
  padding: 5px 0px;
  display: flex;
  flex-direction: column;
  justify-content: stretch;
  position: relative;
  min-width: 240px;
  top: 5px;
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

  &:disabled {
    opacity: 0.5;
    &:hover {
      background-color: ${({ theme }) => theme.black};
    }
  }
`

interface MintToolbarMoreProps {
  children: React.ReactNode
}

export const MintToolbarMore = ({ children }: MintToolbarMoreProps) => {
  return (
    <ToolbarMoreContainer>
      <Dropdown
        expanderStyle={{
          left: 'unset',
          right: '0px',
          background: 'rgba(0,0,0,0)',
        }}
        hover
        animDuration={100}
        renderButton={() => (
          <ToolbarThreeDotsButton tooltip="More">
            <ToolbarThreeDotsVisibleButton tooltip="More">
              <ThreeDotsIcon />
            </ToolbarThreeDotsVisibleButton>
          </ToolbarThreeDotsButton>
        )}
      >
        <ToolbarMoreMenu>{children}</ToolbarMoreMenu>
      </Dropdown>
    </ToolbarMoreContainer>
  )
}

export default MintToolbar
