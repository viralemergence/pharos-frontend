import React, { createContext, useEffect, useReducer } from 'react'

import { AppState } from './types'

import projectReducer, {
  ProjectAction,
  ProjectActions,
  stateInitialValue,
} from './projectReducer'

import synchronizeMessageQueue, {
  StorageMessage,
  StorageMessageStatus,
} from 'storage/synchronizeMessageQueue'
import localforage from 'localforage'

type ProjectContextValue = {
  state: AppState
  dispatch: React.Dispatch<ProjectAction>
}

interface ProjectContextProviderProps {
  children: React.ReactNode
}

export const ProjectContext = createContext<ProjectContextValue | null>(null)

const StateContextProvider = ({ children }: ProjectContextProviderProps) => {
  const [state, dispatch] = useReducer(projectReducer, stateInitialValue)

  const { messageStack } = state

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
          type: ProjectActions.SetMessageStack,
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
    <ProjectContext.Provider value={{ state, dispatch }}>
      {children}
    </ProjectContext.Provider>
  )
}

export default StateContextProvider
