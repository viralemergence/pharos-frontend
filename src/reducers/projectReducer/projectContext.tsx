import React, { createContext, useEffect, useReducer } from 'react'

import { AppState, MessageStackStatus } from './types'

import projectReducer, {
  ProjectAction,
  ProjectActions,
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

  const { messageStackStatus, messageStack } = state
  useEffect(() => {
    if (Object.keys(messageStack).length === 0) return
    if (messageStackStatus === MessageStackStatus.Ready) {
      dispatch({
        type: ProjectActions.SetMessageStackStatus,
        payload: MessageStackStatus.Syncing,
      })
      synchronizeMessageQueue(messageStack, dispatch)
    }
  }, [messageStack, messageStackStatus])

  return (
    <ProjectContext.Provider value={{ state, dispatch }}>
      {children}
    </ProjectContext.Provider>
  )
}

export default StateContextProvider
