import { useContext } from 'react'
import { ContextProps, ModalMessageContext } from './ModalMessageProvider'

const useModalMessage = (): ContextProps => {
  const setModalContent = useContext(ModalMessageContext)

  // when running on the build server, throw an error if
  // setModalContent() is called, because that will cause
  // rehydration issues.
  if (typeof window === 'undefined' && !setModalContent)
    return {
      setModalContent: () => {
        throw new Error('Cannot call setModalContent() in build step')
      },
    }

  if (!setModalContent)
    throw new Error(
      'useModalMessage() must be called from ' +
        'inside the <ModalMessageProvider/>'
    )

  return setModalContent
}

export default useModalMessage
