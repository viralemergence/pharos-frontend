import React, { createContext, useEffect, useReducer } from 'react'
import { Amplify, Auth, Hub } from 'aws-amplify'

import { AppState, UserStatus } from './types'

import stateReducer, { StateAction, StateActions } from './stateReducer'

import synchronizeMessageQueue, {
  StorageMessage,
  StorageMessageStatus,
} from 'storage/synchronizeMessageQueue'
import localforage from 'localforage'
import useLoadUser from 'hooks/dataLoaders/useLoadUser'

import { stateInitialValue } from './initialValues'
import { navigate } from 'gatsby'

type StateContextValue = {
  state: AppState
  dispatch: React.Dispatch<StateAction>
}

interface StateContextProviderProps {
  children: React.ReactNode
}

export const StateContext = createContext<StateContextValue | null>(null)

Amplify.configure({
  Auth: {
    userPoolId: process.env.GATSBY_USER_POOL_ID!,
    userPoolWebClientId: process.env.GATSBY_CLIENT_ID!,
    region: 'us-east-2',
  },
})

const StateContextProvider = ({ children }: StateContextProviderProps) => {
  const [state, dispatch] = useReducer(stateReducer, stateInitialValue)
  const { messageStack } = state

  useLoadUser(dispatch)

  // check pharos major version
  useEffect(() => {
    const pharosMajorVersion = localStorage.getItem('pharosMajorVersion')

    // if there has never been a major version stored
    // this is the migration from no version to pharos-2
    const upgradeNullTo2 = async () => {
      // clear all locally stored data
      await localforage.clear()
      // sign out of cognito (this should do nothing)
      await Auth.signOut()
      // set the major version to the current version
      localStorage.setItem('pharosMajorVersion', '2')
      // reload the page
      window.location.reload()
    }

    if (pharosMajorVersion === null) {
      upgradeNullTo2()
    }
  }, [])

  useEffect(() => {
    // set up and clean up hub listener for auth events
    const stopListening = Hub.listen('auth', ({ payload: { event, data } }) => {
      if (event === 'autoSignIn') {
        dispatch({
          type: StateActions.SetUserStatus,
          payload: {
            status: UserStatus.LoggedIn,
            cognitoUser: data,
          },
        })
      } else if (event === 'autoSignIn_failure') {
        // redirect to sign in page
        console.warn(`${'[HUB]'.padEnd(15)} autoSignIn failure`)
        navigate('/app/#/login/')
      }
    })

    return () => {
      stopListening()
    }
  }, [])

  useEffect(() => {
    const getLocalMessageStack = async () => {
      const stack = (await localforage.getItem('messageStack')) as
        | {
            [key: string]: StorageMessage
          }
        | undefined

      if (stack) {
        console.log(
          `${'[MESSAGES]'.padEnd(15)} Load ${
            Object.keys(stack).length
          } Local Messages`
        )

        const changeStatus = Object.entries(stack).reduce(
          (stack, [key, message]) => ({
            ...stack,
            [key]: {
              ...message,
              // set storage messages to initial so they get retried
              status: StorageMessageStatus.Initial,
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
