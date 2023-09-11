import { Link } from 'gatsby'
import styled, { css } from 'styled-components'

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

export default MintToolbar
