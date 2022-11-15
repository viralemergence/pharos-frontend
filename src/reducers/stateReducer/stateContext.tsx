import React, { createContext, useEffect, useReducer } from 'react'

import { AppState } from './types'

import stateReducer, { StateAction, StateActions } from './stateReducer'

import synchronizeMessageQueue, {
  StorageMessage,
  StorageMessageStatus,
} from 'storage/synchronizeMessageQueue'
import localforage from 'localforage'
import useLoadUser from 'hooks/dataLoaders/useLoadUser'

import { stateInitialValue } from './initialValues'

type StateContextValue = {
  state: AppState
  dispatch: React.Dispatch<StateAction>
}

interface StateContextProviderProps {
  children: React.ReactNode
}

export const StateContext = createContext<StateContextValue | null>(null)

const StateContextProvider = ({ children }: StateContextProviderProps) => {
  const [state, dispatch] = useReducer(stateReducer, stateInitialValue)
  const { messageStack } = state

  useLoadUser(dispatch)

  useEffect(() => {
    const getLocalMessageStack = async () => {
      const stack = (await localforage.getItem('messageStack')) as
        | {
            [key: string]: StorageMessage
          }
        | undefined

      if (stack) {
        console.log(
          `[MESSAGES] Load ${Object.keys(stack).length} Local Messages`
        )

        const changeStatus = Object.entries(stack).reduce(
          (stack, [key, message]) => ({
            ...stack,
            [key]: {
              ...message,
              status:
                // if the messages were initial or pending when saved
                // they should be considered unknown errors now
                message.status === StorageMessageStatus.Initial ||
                message.status === StorageMessageStatus.Pending
                  ? StorageMessageStatus.UnknownError
                  : message.status,
            },
          }),
          {}
        )

        dispatch({
          type: StateActions.SetMessageStack,
          payload: changeStatus,
        })
      }
    }
    getLocalMessageStack()
  }, [])

  useEffect(() => {
    localforage.setItem('messageStack', messageStack)
    synchronizeMessageQueue(messageStack, dispatch)
  }, [messageStack])

  return (
    <StateContext.Provider value={{ state, dispatch }}>
      {children}
    </StateContext.Provider>
  )
}

export default StateContextProvider
