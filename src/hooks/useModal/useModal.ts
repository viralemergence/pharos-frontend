import { useContext } from 'react'
import {
  SetModalContentWithOpts,
  ModalMessageContext,
} from './ModalMessageProvider'

const useModal = (): SetModalContentWithOpts => {
  const setModalContent = useContext(ModalMessageContext)

  // when running on the build server, throw an error if
  // setModalContent() is called, because that will cause
  // rehydration issues.
  if (typeof window === 'undefined' && !setModalContent)
    return {
      // @ts-expect-error: throw error if this is called in build server
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

export default useModal
