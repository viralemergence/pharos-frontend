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
    // only mark the messageStack as ready if it
    // hits a point where there are zero items.
    if (Object.keys(messageStack).length === 0)
      dispatch({
        type: ProjectActions.SetMessageStackStatus,
        payload: MessageStackStatus.Ready,
      })

    if (messageStackStatus === MessageStackStatus.Ready) {
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
