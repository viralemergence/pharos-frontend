import React, { createContext, useState } from 'react'
import Modal from 'components/ui/Modal'

export type SetModalContentWithOpts = (
  content: React.SetStateAction<React.ReactNode>,
  opts?: Opts
) => void

export const ModalMessageContext =
  createContext<SetModalContentWithOpts | null>(null)

interface ProviderProps {
  children: React.ReactNode
}

interface Opts {
  closeable?: boolean
}

const ModalMessageProvider = ({ children }: ProviderProps): JSX.Element => {
  const [modalContent, setModalContent] = useState<React.ReactNode>(null)
  const [opts, setOpts] = useState<Opts>({})

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

  const setModalContentWithOpts: SetModalContentWithOpts = (content, opts) => {
    setModalContent(content)
    setOpts(opts ?? {})
  }

  return (
    <ModalMessageContext.Provider value={setModalContentWithOpts}>
      {children}
      <Modal
        open={modalContent !== null}
        setOpen={setOpen}
        closeable={opts.closeable}
      >
        {modalContent}
      </Modal>
    </ModalMessageContext.Provider>
  )
}

export default ModalMessageProvider
