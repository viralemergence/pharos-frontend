import React from 'react'
import styled from 'styled-components'

const Button = styled.button<{ open: boolean }>`
  width: 30px;
  height: 25px;
  position: relative;
  -webkit-transform: rotate(0deg);
  -moz-transform: rotate(0deg);
  -o-transform: rotate(0deg);
  transform: rotate(0deg);
  -webkit-transition: 0.5s ease-in-out;
  -moz-transition: 0.5s ease-in-out;
  -o-transition: 0.5s ease-in-out;
  transition: 0.5s ease-in-out;
  cursor: pointer;
  border: none;
  background: none;
  margin: 5px 20px;

  span {
    display: block;
    position: absolute;
    height: 4px;
    width: 100%;
    background: white;
    border-radius: 2px;
    opacity: 1;
    left: 0;
    -webkit-transform: rotate(0deg);
    -moz-transform: rotate(0deg);
    -o-transform: rotate(0deg);
    transform: rotate(0deg);
    transition: 0.25s ease-in-out;
  }

  span:nth-child(1) {
    top: 0px;
  }

  span:nth-child(2),
  span:nth-child(3) {
    top: calc(50% - 2px);
  }

  span:nth-child(4) {
    top: calc(100% - 4px);
  }

  ${({ open }) =>
    open &&
    `
      span:nth-child(1) {
        top: calc(50% - 2px);
        width: 0%;
        left: 50%;
      }

      span:nth-child(2) {
        -webkit-transform: rotate(45deg);
        -moz-transform: rotate(45deg);
        -o-transform: rotate(45deg);
        transform: rotate(45deg);
      }

      span:nth-child(3) {
        -webkit-transform: rotate(-45deg);
        -moz-transform: rotate(-45deg);
        -o-transform: rotate(-45deg);
        transform: rotate(-45deg);
      }

      span:nth-child(4) {
        top: calc(50% - 2px);
        width: 0%;
        left: 50%;
      }
  `}
`

interface HamburgerButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  open: boolean
}

const HamburgerButton = ({ open, ...props }: HamburgerButtonProps) => (
  <Button
    {...props}
    open={open}
    aria-label={`${open ? 'close' : 'open'} nav menu`}
  >
    <span />
    <span />
    <span />
    <span />
  </Button>
)

export default HamburgerButton
