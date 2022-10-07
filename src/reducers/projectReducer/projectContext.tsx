import React, { createContext, useEffect, useReducer } from 'react'

import { AppState, MessageStackStatus } from './types'

import projectReducer, {
  ProjectAction,
  ProjectActions,
  stateInitialValue,
} from './projectReducer'

import synchronizeMessageQueue, {
  StorageMessage,
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
        console.log('[MESSAGES] Load Local Messages')
        dispatch({
          type: ProjectActions.SetMessageStack,
          payload: stack,
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
