import React, { createContext, useState } from 'react'
import Modal from 'components/ui/Modal'

type setModalContent = React.Dispatch<React.SetStateAction<React.ReactNode>>

export const ModalMessageContext = createContext<setModalContent | null>(null)

interface ProviderProps {
  children: React.ReactNode
}

const ModalMessageProvider = ({ children }: ProviderProps): JSX.Element => {
  const [modalContent, setModalContent] = useState<React.ReactNode>(null)

  // wrapping setModalContent in a mock setStateAction so
  // modal component gets the props it expects but the modal
  // can be simplified to show when there is content and hide
  // when there is no content.
  const setOpen = (
    open: boolean | (boolean | ((prevState: boolean) => boolean))
  ) => {
    if (typeof open === 'boolean' && !open) setModalContent(null)
    if (typeof open === 'function' && open(true)) setModalContent(null)
  }

  return (
    <>
      <ModalMessageContext.Provider value={setModalContent}>
        {children}
      </ModalMessageContext.Provider>
      <Modal open={modalContent !== null} setOpen={setOpen}>
        {modalContent}
      </Modal>
    </>
  )
}

export default ModalMessageProvider
