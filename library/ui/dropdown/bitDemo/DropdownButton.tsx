import styled from 'styled-components'

const DropdownButton = styled.button<{ open: boolean; animDuration: number }>`
  background-color: ${({ open }) => (open ? '#647687' : '#7d91a3')};
  transition: ${({ animDuration }) => animDuration + 'ms ease'};
  border-top-right-radius: 3px;
  border-top-left-radius: 3px;
  align-items: center;
  padding: 10px 15px;
  display: flex;
  border: none;
  color: white;
`

export const DropdownCaret = styled.div<{
  open: boolean
  animDuration: number
}>`
  background-image: url("data:image/svg+xml,%3Csvg width='12' height='6' viewBox='0 0 12 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0L6 6L12 0H0Z' fill='%233A3A3C'/%3E%3C/svg%3E%0A");
  transform: ${({ open }) => (open ? `scaleY(-1)` : `scaleY(1)`)};
  transition: ${({ animDuration }) => animDuration + 'ms ease'};
  background-position: 100% 50%;
  background-repeat: no-repeat;
  background-size: contain;
  margin-left: 15px;
  height: 10px;
  width: 15px;
`

export default DropdownButton
