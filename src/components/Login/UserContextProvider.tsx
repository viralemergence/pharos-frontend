import React, { createContext, useState, useEffect } from 'react'
import localforage from 'localforage'

export enum UserStatus {
  'initial',
  'loggedOut',
  'loggedIn',
  'sessionExpired',
  'invalidUser',
  'authError',
}

export interface User {
  status: UserStatus
  statusMessage: string
  data?: {
    researcherID: string
    organization: string
    email: string
    name: string
    projectIDs?: string[]
  }
}

export type UserContext = {
  user: User
  setUser: React.Dispatch<React.SetStateAction<User>>
}

export const UserContext = createContext<UserContext | null>(null)

interface CMSIconProviderProps {
  children: React.ReactNode
}

export const defaultUserState = {
  status: UserStatus.initial,
  statusMessage: 'Unknown user state',
}

const UserContextProvider = ({
  children,
}: CMSIconProviderProps): JSX.Element => {
  const [user, setUser] = useState<User>(defaultUserState)

  // async check for local user data
  useEffect(() => {
    const getLocalUser = async () => {
      const localUser = (await localforage.getItem('user')) as User | null

      if (localUser) {
        // set local data in state
        setUser(localUser)

        // request updated user data
        const response = await fetch(`${process.env.GATSBY_API_URL}/auth`, {
          method: 'POST',
          body: `{"researcherID":"${localUser.data?.researcherID}"}`,
        }).catch(error => console.log(error))

        // if it's valid set the updated data in state
        if (response && response.ok) {
          const updatedUserData = await response.json()
          setUser({
            status: UserStatus.loggedIn,
            statusMessage: 'Logged in',
            data: updatedUserData,
          })
        }
      }

      // if no local user data, set the user
      // to logged out state now that we're sure
      else
        setUser({
          status: UserStatus.loggedOut,
          statusMessage: 'Logged out',
        })
    }

    getLocalUser()
  }, [])

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  )
}

export default UserContextProvider
