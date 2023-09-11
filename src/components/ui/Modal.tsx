import React from 'react'
import styled from 'styled-components'

import { createPortal } from 'react-dom'

const ModalContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99;
`
const ModalBackgroundButton = styled.button`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.25);
  border: none;
  border-radius: 0;
`
const ModalBackground = styled.div`
  position: relative;
  margin-top: 7rem;
  padding: 15px;
  background-color: #fff;
  max-height: 80vh;
  max-width: 90vw;
  border-radius: 0px;
  box-shadow: 3px 3px 20px rgba(0, 0, 0, 0.25);
  overflow: scroll;
  z-index: 10;
`
const CloseModalButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  border: none;
  background: none;
  background-image: url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg clip-path='url(%23clip0_5692_4738)'%3E%3Cpath d='M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z' fill='%237D838A'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0_5692_4738'%3E%3Crect width='24' height='24' fill='white'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E%0A");
  height: 24px;
  width: 24px;
  background-color: rgba(0, 0, 0, 0);
  border-radius: 3px;
  transition: 150ms ease;

  &:hover {
    cursor: pointer;
    background-color: ${({ theme }) => theme.lightGray};
    transition: 250ms ease;
  }
`

interface ModalProps {
  open: boolean
  children: React.ReactNode
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>
  closeable?: boolean
}

const Modal = ({
  open,
  setOpen,
  children,
  closeable = false,
}: ModalProps): JSX.Element => {
  if (!open) return <></>

  return createPortal(
    <ModalContainer
      onClick={e => e.stopPropagation()}
      onMouseDown={e => e.stopPropagation()}
      onMouseMove={e => e.stopPropagation()}
      onMouseUp={e => e.stopPropagation()}
    >
      <ModalBackgroundButton
        disabled={!closeable}
        aria-label="Close Modal"
        onClick={() => setOpen && setOpen(false)}
      />
      <ModalBackground>
        {closeable && (
          <CloseModalButton
            aria-label="Close Modal"
            onClick={() => setOpen && setOpen(false)}
          />
        )}
        {children}
      </ModalBackground>
    </ModalContainer>,
    document.body
  )
}
export default Modal
