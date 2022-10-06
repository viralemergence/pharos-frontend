import React, { createContext, useEffect, useReducer } from 'react'

import { AppState } from './types'

import projectReducer, {
  ProjectAction,
  stateInitialValue,
} from './projectReducer'

import synchronizeMessageQueue from 'storage/synchronizeMessageQueue'

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

  const { status, messageStack } = state
  useEffect(() => {
    if (Object.keys(messageStack).length === 0) return
    synchronizeMessageQueue(messageStack, dispatch)
  }, [messageStack, status])

  return (
    <ProjectContext.Provider value={{ state, dispatch }}>
      {children}
    </ProjectContext.Provider>
  )
}

export default StateContextProvider
