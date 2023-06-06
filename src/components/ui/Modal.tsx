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
  z-index: ${({ theme }) => theme.zIndexes.modalContainer};
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
  z-index: ${({ theme }) => theme.zIndexes.modalBackground};
`
const CloseModalButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  border: none;
  background: none;
  background-image: url("data:image/svg+xml,%3Csvg version='1.1' id='Layer_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='0 0 105 105' style='enable-background:new 0 0 105 105;' xml:space='preserve'%3E%3Cpath style='fill:%23050A37;' d='M52.5,0C23.51,0,0,23.51,0,52.5C0,81.49,23.51,105,52.5,105c28.99,0,52.5-23.51,52.5-52.5 C105,23.51,81.49,0,52.5,0z M74.42,82.91L52.5,60.99L30.93,82.55l-8.49-8.49L44.01,52.5L22.09,30.58l8.49-8.49L52.5,44.01 l21.57-21.57l8.49,8.49L60.99,52.5l21.92,21.92L74.42,82.91z'/%3E%3C/svg%3E%0A");
  height: 18px;
  width: 18px;
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
